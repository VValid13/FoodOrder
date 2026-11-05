import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { isOpenAt } from '../_utils/helpers/is-open-at.helper.js';
import type { Session } from '../database/database.types.js';
import { RestaurantsService } from '../restaurants/restaurants.service.js';
import { SESSION_STATUSES } from './_utils/constants/sessions.constants.js';
import type { CreateSessionDto } from './_utils/dtos/requests/create-session.dto.js';
import type { FindSessionsDto } from './_utils/dtos/requests/find-sessions.dto.js';
import type { UpdateSessionDto } from './_utils/dtos/requests/update-session.dto.js';
import type { SessionResponseDto } from './_utils/dtos/responses/session.response.dto.js';
import { SessionsExceptions } from './_utils/exceptions/sessions.exceptions.js';
import { SessionMapper } from './_utils/mappers/session.mapper.js';
import type { SessionSchedule } from './_utils/types/session-values.type.js';
import { SessionsRepository } from './sessions.repository.js';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly sessionMapper: SessionMapper,
    private readonly sessionsExceptions: SessionsExceptions,
    private readonly restaurantsService: RestaurantsService,
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
    creatorId: UUID,
    { status }: FindSessionsDto,
  ): Promise<SessionResponseDto[]> {
    return this.sessionMapper.toSessionResponseList(
      await this.sessionsRepository.findAllSessions(creatorId, status),
    );
  }

  findSession(session: Selectable<Session>): SessionResponseDto {
    return this.sessionMapper.toSessionResponse(session);
  }

  async updateSession(
    session: Selectable<Session>,
    updateSessionDto: UpdateSessionDto,
  ): Promise<SessionResponseDto> {
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
