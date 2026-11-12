import type { Selectable } from 'kysely';
import type { Session, SessionMember } from '../../../database/database.types.js';

export type UserInvitation = Selectable<Session> &
  Pick<Selectable<SessionMember>, 'userId'> & {
    participantId: Selectable<SessionMember>['id'];
    participantName: Selectable<SessionMember>['name'];
    participantStatus: Selectable<SessionMember>['status'];
  };
