import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { USER_ROLES } from '../_utils/constants/user-role.constants.js';
import { isOpenAt } from '../_utils/helpers/is-open-at.helper.js';
import type { Session, SessionStatus } from '../database/database.types.js';
import { RestaurantsService } from '../restaurants/restaurants.service.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  SESSION_STATUS_CHANGED_EVENT,
  SESSION_STATUSES,
  SESSION_TRANSITIONS,
} from './_utils/constants/sessions.constants.js';
import type { CreateSessionDto } from './_utils/dtos/requests/create-session.dto.js';
import type { FindSessionsDto } from './_utils/dtos/requests/find-sessions.dto.js';
import type { ReopenSessionDto } from './_utils/dtos/requests/reopen-session.dto.js';
import type { UpdateSessionDto } from './_utils/dtos/requests/update-session.dto.js';
import type { SessionResponseDto } from './_utils/dtos/responses/session.response.dto.js';
import { SessionsExceptions } from './_utils/exceptions/sessions.exceptions.js';
import { SessionMapper } from './_utils/mappers/session.mapper.js';
import type {
  SessionStatusChangedEvent,
  SessionTransition,
} from './_utils/types/session-transition.type.js';
import type { SessionChanges, SessionSchedule } from './_utils/types/session-values.type.js';
import { SessionsRepository } from './sessions.repository.js';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly sessionMapper: SessionMapper,
    private readonly sessionsExceptions: SessionsExceptions,
    private readonly restaurantsService: RestaurantsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createSession(
    createSessionDto: CreateSessionDto,
    creatorId: UUID,
  ): Promise<SessionResponseDto> {
    this.ensureFutureDeadline(createSessionDto.deadlineAt);
    await this.ensureValidPickup(createSessionDto.restaurantId, createSessionDto);

    const session = await this.sessionsRepository.createSession(
      this.sessionMapper.toNewSession(createSessionDto, creatorId),
    );
    return this.sessionMapper.toSessionResponse(session);
  }

  async findAllSessions(
    user: UserEntity,
    { status }: FindSessionsDto,
  ): Promise<SessionResponseDto[]> {
    const creatorId = user.role === USER_ROLES.ADMIN ? undefined : user.id;
    return this.sessionMapper.toSessionResponseList(
      await this.sessionsRepository.findAllSessions(creatorId, status),
    );
  }

  findSession(session: Selectable<Session>, user: UserEntity): SessionResponseDto {
    this.checkOwnerOrAdmin(session, user);
    return this.sessionMapper.toSessionResponse(session);
  }

  async updateSession(
    session: Selectable<Session>,
    updateSessionDto: UpdateSessionDto,
    user: UserEntity,
  ): Promise<SessionResponseDto> {
    this.checkOwnerOrAdmin(session, user);
    if (session.status === SESSION_STATUSES.ORDERED) {
      throw this.sessionsExceptions.alreadyOrdered;
    }

    const { deadlineAt, pickupAt } = updateSessionDto;
    if (deadlineAt) {
      this.ensureFutureDeadline(deadlineAt);
    }
    if (deadlineAt || pickupAt) {
      await this.ensureValidPickup(session.restaurantId, {
        deadlineAt: deadlineAt ?? session.deadlineAt,
        pickupAt: pickupAt ?? session.pickupAt,
      });
    }

    return this.sessionMapper.toSessionResponse(
      await this.sessionsRepository.updateSession(session.id, updateSessionDto),
    );
  }

  async openSession(session: Selectable<Session>, user: UserEntity): Promise<SessionResponseDto> {
    this.checkOwnerOrAdmin(session, user);
    this.checkTransition(session.status, SESSION_TRANSITIONS.OPEN);
    this.ensureFutureDeadline(session.deadlineAt);
    if (!session.freeMode && !(await this.sessionsRepository.hasActiveDish(session.restaurantId))) {
      throw this.sessionsExceptions.emptyMenu;
    }

    return await this.applyTransition(session.id, SESSION_TRANSITIONS.OPEN);
  }

  async closeSession(session: Selectable<Session>, user: UserEntity): Promise<SessionResponseDto> {
    this.checkOwnerOrAdmin(session, user);
    this.checkTransition(session.status, SESSION_TRANSITIONS.CLOSE);
    return await this.applyTransition(session.id, SESSION_TRANSITIONS.CLOSE);
  }

  async reopenSession(
    session: Selectable<Session>,
    reopenSessionDto: ReopenSessionDto,
    user: UserEntity,
  ): Promise<SessionResponseDto> {
    this.checkOwnerOrAdmin(session, user);
    this.checkTransition(session.status, SESSION_TRANSITIONS.REOPEN);

    const { deadlineAt, pickupAt } = reopenSessionDto;
    if (!deadlineAt && !dayjs(session.deadlineAt).isAfter(dayjs())) {
      throw this.sessionsExceptions.deadlineRequired;
    }
    if (deadlineAt) {
      this.ensureFutureDeadline(deadlineAt);
    }
    if (deadlineAt || pickupAt) {
      await this.ensureValidPickup(session.restaurantId, {
        deadlineAt: deadlineAt ?? session.deadlineAt,
        pickupAt: pickupAt ?? session.pickupAt,
      });
    }

    return await this.applyTransition(session.id, SESSION_TRANSITIONS.REOPEN, reopenSessionDto);
  }

  async markSessionOrdered(
    session: Selectable<Session>,
    user: UserEntity,
  ): Promise<SessionResponseDto> {
    this.checkOwnerOrAdmin(session, user);
    this.checkTransition(session.status, SESSION_TRANSITIONS.MARK_ORDERED);
    return await this.applyTransition(session.id, SESSION_TRANSITIONS.MARK_ORDERED);
  }

  private async applyTransition(
    sessionId: UUID,
    transition: SessionTransition,
    changes?: SessionChanges,
  ): Promise<SessionResponseDto> {
    const result = await this.sessionsRepository.updateSessionStatus(
      sessionId,
      transition,
      changes,
    );
    if (!result) {
      throw this.sessionsExceptions.invalidTransition;
    }

    const event: SessionStatusChangedEvent = { sessionId, from: result.from, to: transition.to };
    this.eventEmitter.emit(SESSION_STATUS_CHANGED_EVENT, event);
    return this.sessionMapper.toSessionResponse(result.session);
  }

  private checkTransition(status: SessionStatus, { from }: SessionTransition): void {
    if (!from.includes(status)) {
      throw this.sessionsExceptions.invalidTransition;
    }
  }

  private checkOwnerOrAdmin(session: Selectable<Session>, user: UserEntity): void {
    if (session.creatorId !== user.id && user.role !== USER_ROLES.ADMIN) {
      throw this.sessionsExceptions.accessForbidden;
    }
  }

  private ensureFutureDeadline(deadlineAt: Date): void {
    if (!dayjs(deadlineAt).isAfter(dayjs())) {
      throw this.sessionsExceptions.deadlineInPast;
    }
  }

  private async ensureValidPickup(
    restaurantId: UUID,
    { deadlineAt, pickupAt }: SessionSchedule,
  ): Promise<void> {
    if (!dayjs(pickupAt).isAfter(deadlineAt)) {
      throw this.sessionsExceptions.pickupBeforeDeadline;
    }

    const { timezone, openingHours } =
      await this.restaurantsService.findRestaurantSchedule(restaurantId);
    if (!isOpenAt(openingHours, timezone, pickupAt)) {
      throw this.sessionsExceptions.restaurantClosed;
    }
  }
}
