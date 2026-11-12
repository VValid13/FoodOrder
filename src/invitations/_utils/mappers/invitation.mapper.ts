import { Injectable } from '@nestjs/common';
import type { Selectable } from 'kysely';
import { randomBytes } from 'node:crypto';
import type { UUID } from 'node:crypto';
import { hashTokenHelper } from '../../../_utils/helpers/hash-token.helper.js';
import type { Session, SessionMember } from '../../../database/database.types.js';
import type { RestaurantWithMenuResponseDto } from '../../../restaurants/_utils/dtos/responses/restaurant-with-menu.response.dto.js';
import type { GetUserDto } from '../../../users/_utils/dtos/responses/get-user.dto.js';
import { INVITATION_TOKEN_BYTES } from '../constants/invitations.constants.js';
import type { InvitationSessionResponseDto } from '../dtos/responses/invitation-session.response.dto.js';
import type { InvitationsResponseDto } from '../dtos/responses/invitations.response.dto.js';
import type { InvitedParticipantResponseDto } from '../dtos/responses/invited-participant.response.dto.js';
import type { MyInvitationResponseDto } from '../dtos/responses/my-invitation.response.dto.js';
import type { ParticipantResponseDto } from '../dtos/responses/participant.response.dto.js';
import type { UserInvitationResponseDto } from '../dtos/responses/user-invitation.response.dto.js';
import type { ParticipantContext } from '../types/participant-context.type.js';
import type { UserInvitation } from '../types/user-invitation.type.js';
import type {
  InvitationToken,
  Invitee,
  ParticipantInvitation,
} from '../types/participant-values.type.js';

@Injectable()
export class InvitationMapper {
  constructor(private readonly hashTokenHelper: hashTokenHelper) {}

  toGuestInvitees(names: string[]): Invitee[] {
    return names.map((name) => ({ name, userId: null }));
  }

  toContactInvitees(contacts: GetUserDto[]): Invitee[] {
    return contacts.map(({ id, username }) => ({ name: username, userId: id }));
  }

  toInvitations(sessionId: UUID, invitees: Invitee[]): ParticipantInvitation[] {
    return invitees.map((invitee) => this.toInvitation(sessionId, invitee));
  }

  toInvitationsResponse(
    invitations: ParticipantInvitation[],
    participants: Selectable<SessionMember>[],
  ): InvitationsResponseDto {
    const participantsByTokenHash = new Map(
      participants.map((participant) => [participant.tokenHash, participant]),
    );
    return {
      participants: invitations.flatMap(({ token, participant: { tokenHash } }) => {
        const participant = participantsByTokenHash.get(tokenHash);
        return participant ? [this.toInvitedParticipantResponse(participant, token)] : [];
      }),
      skippedNames: invitations
        .filter(({ participant: { tokenHash } }) => !participantsByTokenHash.has(tokenHash))
        .map(({ participant: { name } }) => name),
    };
  }

  toInvitationToken(): InvitationToken {
    const token = randomBytes(INVITATION_TOKEN_BYTES).toString('base64url');
    return { token, tokenHash: this.hashTokenHelper.hashRefreshToken(token) };
  }

  toParticipantContext(
    participant: Selectable<SessionMember>,
    session: Selectable<Session>,
  ): ParticipantContext {
    return { participant, session };
  }

  toInvitedParticipantResponse(
    participant: Selectable<SessionMember>,
    token: string,
  ): InvitedParticipantResponseDto {
    return { ...this.toParticipantResponse(participant), token };
  }

  toMyInvitationResponse(
    participant: Selectable<SessionMember>,
    session: Selectable<Session>,
    restaurant: RestaurantWithMenuResponseDto,
  ): MyInvitationResponseDto {
    return {
      participant: this.toParticipantResponse(participant),
      session: this.toInvitationSessionResponse(session),
      restaurant,
    };
  }

  toUserInvitationResponseList(userInvitations: UserInvitation[]): UserInvitationResponseDto[] {
    return userInvitations.map(
      ({ participantId, participantName, participantStatus, userId, ...session }) => ({
        participant: {
          id: participantId,
          name: participantName,
          userId,
          status: participantStatus,
        },
        session: this.toInvitationSessionResponse(session),
      }),
    );
  }

  toInvitation(sessionId: UUID, invitee: Invitee): ParticipantInvitation {
    const { token, tokenHash } = this.toInvitationToken();
    return { token, participant: { ...invitee, sessionId, tokenHash } };
  }

  toParticipantResponse(participant: Selectable<SessionMember>): ParticipantResponseDto {
    return {
      id: participant.id,
      name: participant.name,
      userId: participant.userId,
      status: participant.status,
    };
  }

  private toInvitationSessionResponse(session: Selectable<Session>): InvitationSessionResponseDto {
    return {
      id: session.id,
      label: session.label,
      status: session.status,
      deadlineAt: session.deadlineAt,
      pickupAt: session.pickupAt,
      paymentMode: session.paymentMode,
      payerName: session.payerName,
      fees: session.fees,
      discount: session.discount,
      freeMode: session.freeMode,
    };
  }
}
