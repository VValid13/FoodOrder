import type { UUID } from 'node:crypto';
import type { SessionStatus } from '../../../database/database.types.js';

export type SessionTransition = {
  from: SessionStatus;
  to: SessionStatus;
};

export type SessionStatusChangedEvent = {
  sessionId: UUID;
  from: SessionStatus;
  to: SessionStatus;
};
