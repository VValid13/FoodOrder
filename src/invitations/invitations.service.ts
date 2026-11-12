import { Injectable } from '@nestjs/common';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { ContactService } from '../contacts/contacts.service.js';
import type { Session, SessionMember } from '../database/database.types.js';
import { RestaurantsService } from '../restaurants/restaurants.service.js';
import { SESSION_STATUSES } from '../sessions/_utils/constants/sessions.constants.js';
import { SessionsService } from '../sessions/sessions.service.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  INVITABLE_SESSION_STATUSES,
  PARTICIPANT_STATUSES,
} from './_utils/constants/invitations.constants.js';
import type { CreateInvitationsDto } from './_utils/dtos/requests/create-invitations.dto.js';
import type { JoinPublicLinkDto } from './_utils/dtos/requests/join-public-link.dto.js';
import type { InvitationsResponseDto } from './_utils/dtos/responses/invitations.response.dto.js';
import type { InvitedParticipantResponseDto } from './_utils/dtos/responses/invited-participant.response.dto.js';
import type { MyInvitationResponseDto } from './_utils/dtos/responses/my-invitation.response.dto.js';
import type { ParticipantResponseDto } from './_utils/dtos/responses/participant.response.dto.js';
import type { UserInvitationResponseDto } from './_utils/dtos/responses/user-invitation.response.dto.js';
import { InvitationsExceptions } from './_utils/exceptions/invitations.exceptions.js';
import { InvitationMapper } from './_utils/mappers/invitation.mapper.js';
import type { ParticipantContext } from './_utils/types/participant-context.type.js';
import type { Invitee } from './_utils/types/participant-values.type.js';
import { InvitationsRepository } from './invitations.repository.js';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly invitationMapper: InvitationMapper,
    private readonly invitationsExceptions: InvitationsExceptions,
    private readonly sessionsService: SessionsService,
    private readonly contactService: ContactService,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async createInvitations(
    session: Selectable<Session>,
    { names }: CreateInvitationsDto,
    user: UserEntity,
  ): Promise<InvitationsResponseDto> {
    this.checkSessionInvitable(session, user);
    return await this.inviteParticipants(session, this.invitationMapper.toGuestInvitees(names));
  }

  async createContactListInvitations(
    session: Selectable<Session>,
    contactListId: UUID,
    user: UserEntity,
  ): Promise<InvitationsResponseDto> {
    this.checkSessionInvitable(session, user);
    const { users } = await this.contactService.getUsersInGroupById(user.id, contactListId);
    if (users.length === 0) {
      throw this.invitationsExceptions.contactListEmpty;
    }

    return await this.inviteParticipants(session, this.invitationMapper.toContactInvitees(users));
  }

  async regenerateParticipantLink(
    session: Selectable<Session>,
    participant: Selectable<SessionMember>,
    user: UserEntity,
  ): Promise<InvitedParticipantResponseDto> {
    this.checkSessionParticipant(session, participant, user);
    const { token, tokenHash } = this.invitationMapper.toInvitationToken();
    return this.invitationMapper.toInvitedParticipantResponse(
      await this.invitationsRepository.updateParticipantTokenHash(participant.id, tokenHash),
      token,
    );
  }

  async revokeParticipantLink(
    session: Selectable<Session>,
    participant: Selectable<SessionMember>,
    user: UserEntity,
  ): Promise<void> {
    this.checkSessionParticipant(session, participant, user);
    await this.invitationsRepository.updateParticipantTokenHash(participant.id, null);
  }

  async findMyInvitation({
    participant,
    session,
  }: ParticipantContext): Promise<MyInvitationResponseDto> {
    const currentParticipant =
      participant.status === PARTICIPANT_STATUSES.INVITED
        ? await this.invitationsRepository.updateParticipantStatus(
            participant.id,
            PARTICIPANT_STATUSES.SEEN,
          )
        : participant;
    return this.invitationMapper.toMyInvitationResponse(
      currentParticipant,
      session,
      await this.restaurantsService.findRestaurant(session.restaurantId),
    );
  }

  async joinPublicLink(
    shareToken: string,
    { name }: JoinPublicLinkDto,
  ): Promise<InvitedParticipantResponseDto> {
    const session = await this.invitationsRepository.findSessionByShareToken(shareToken);
    if (!session?.publicLinkEnabled) {
      throw this.invitationsExceptions.publicLinkNotFound;
    }
    if (session.status !== SESSION_STATUSES.OPEN) {
      throw this.invitationsExceptions.sessionNotOpen;
    }

    const { token, participant: newParticipant } = this.invitationMapper.toInvitation(session.id, {
      name,
      userId: null,
    });
    const participants = await this.invitationsRepository.createParticipants(session.id, [
      newParticipant,
    ]);
    if (!participants) {
      throw this.invitationsExceptions.participantsLimitReached;
    }
    const [participant] = participants;
    if (!participant) {
      throw this.invitationsExceptions.nameTaken;
    }

    return this.invitationMapper.toInvitedParticipantResponse(participant, token);
  }

  async linkParticipantAccount(
    { participant }: ParticipantContext,
    user: UserEntity,
  ): Promise<ParticipantResponseDto> {
    if (participant.userId === user.id) {
      return this.invitationMapper.toParticipantResponse(participant);
    }

    const linkedParticipant = await this.invitationsRepository.linkParticipantAccount(
      participant,
      user.id,
    );
    if (!linkedParticipant) {
      throw this.invitationsExceptions.participantAlreadyLinked;
    }

    return this.invitationMapper.toParticipantResponse(linkedParticipant);
  }

  async findUserInvitations(user: UserEntity): Promise<UserInvitationResponseDto[]> {
    return this.invitationMapper.toUserInvitationResponseList(
      await this.invitationsRepository.findUserInvitations(user.id),
    );
  }

  private checkSessionInvitable(session: Selectable<Session>, user: UserEntity): void {
    this.sessionsService.checkOwnerOrAdmin(session, user);
    if (!INVITABLE_SESSION_STATUSES.includes(session.status)) {
      throw this.invitationsExceptions.sessionNotInvitable;
    }
  }

  private async inviteParticipants(
    session: Selectable<Session>,
    invitees: Invitee[],
  ): Promise<InvitationsResponseDto> {
    const invitations = this.invitationMapper.toInvitations(session.id, invitees);
    const participants = await this.invitationsRepository.createParticipants(
      session.id,
      invitations.map(({ participant }) => participant),
    );
    if (!participants) {
      throw this.invitationsExceptions.participantsLimitReached;
    }

    return this.invitationMapper.toInvitationsResponse(invitations, participants);
  }

  private checkSessionParticipant(
    session: Selectable<Session>,
    participant: Selectable<SessionMember>,
    user: UserEntity,
  ): void {
    this.sessionsService.checkOwnerOrAdmin(session, user);
    if (participant.sessionId !== session.id) {
      throw this.invitationsExceptions.participantNotFound;
    }
  }
}
