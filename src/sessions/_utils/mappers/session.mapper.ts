import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { generateToken } from '../../../_utils/helpers/generate-token.helper.js';
import type { Session } from '../../../database/database.types.js';
import {
  SESSION_LIFETIME_DAYS,
  SESSION_SHARE_TOKEN_LENGTH,
} from '../constants/sessions.constants.js';
import type { CreateSessionDto } from '../dtos/requests/create-session.dto.js';
import type { SessionResponseDto } from '../dtos/responses/session.response.dto.js';
import type { NewSessionValues } from '../types/session-values.type.js';

@Injectable()
export class SessionMapper {
  toNewSession(createSessionDto: CreateSessionDto, creatorId: UUID): NewSessionValues {
    return {
      ...createSessionDto,
      creatorId,
      shareToken: generateToken(SESSION_SHARE_TOKEN_LENGTH),
      expiresAt: dayjs().add(SESSION_LIFETIME_DAYS, 'day').toDate(),
    };
  }

  toSessionResponse(session: Selectable<Session>): SessionResponseDto {
    return {
      id: session.id,
      restaurantId: session.restaurantId,
      label: session.label,
      status: session.status,
      deadlineAt: session.deadlineAt,
      pickupAt: session.pickupAt,
      paymentMode: session.paymentMode,
      payerName: session.payerName,
      fees: session.fees,
      discount: session.discount,
      freeMode: session.freeMode,
      shareToken: session.shareToken,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  toSessionResponseList = (sessions: Selectable<Session>[]): SessionResponseDto[] =>
    sessions.map((session) => this.toSessionResponse(session));
}
