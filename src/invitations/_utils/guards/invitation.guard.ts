import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { hashTokenHelper } from '../../../_utils/helpers/hash-token.helper.js';
import { InvitationsRepository } from '../../invitations.repository.js';
import { INVITATION_TOKEN_HEADER } from '../constants/invitations.constants.js';
import { InvitationsExceptions } from '../exceptions/invitations.exceptions.js';
import { InvitationMapper } from '../mappers/invitation.mapper.js';
import type { ParticipantContext } from '../types/participant-context.type.js';

@Injectable()
export class InvitationGuard implements CanActivate {
  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly invitationsExceptions: InvitationsExceptions,
    private readonly invitationMapper: InvitationMapper,
    private readonly hashTokenHelper: hashTokenHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { participantContext: ParticipantContext }>();
    const token = request.headers[INVITATION_TOKEN_HEADER];
    if (typeof token !== 'string') {
      throw this.invitationsExceptions.invalidInvitationLink;
    }

    const participant = await this.invitationsRepository.findParticipantByTokenHash(
      this.hashTokenHelper.hashRefreshToken(token),
    );
    if (!participant) {
      throw this.invitationsExceptions.invalidInvitationLink;
    }

    request.participantContext = this.invitationMapper.toParticipantContext(
      participant,
      await this.invitationsRepository.findSessionByIdOrFail(participant.sessionId),
    );
    return true;
  }
}
