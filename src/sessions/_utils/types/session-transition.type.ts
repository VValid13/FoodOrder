import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import type { Session, SessionStatus } from '../../../database/database.types.js';

export type SessionTransition = {
  from: readonly SessionStatus[];
  to: SessionStatus;
};

export type SessionStatusChangedEvent = {
  sessionId: UUID;
  from: SessionStatus;
  to: SessionStatus;
};

export type SessionTransitionResult = {
  from: SessionStatus;
  session: Selectable<Session>;
};
