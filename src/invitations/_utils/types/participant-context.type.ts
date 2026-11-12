import type { Selectable } from 'kysely';
import type { Session, SessionMember } from '../../../database/database.types.js';

export type ParticipantContext = {
  participant: Selectable<SessionMember>;
  session: Selectable<Session>;
};
