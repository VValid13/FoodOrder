import type { Insertable } from 'kysely';
import type { SessionMember } from '../../../database/database.types.js';

export type NewParticipantValues = Pick<
  Insertable<SessionMember>,
  'sessionId' | 'name' | 'userId'
> & {
  tokenHash: string;
};

export type Invitee = Pick<NewParticipantValues, 'name' | 'userId'>;

export type ParticipantInvitation = {
  token: string;
  participant: NewParticipantValues;
};

export type InvitationToken = {
  token: string;
  tokenHash: string;
};
