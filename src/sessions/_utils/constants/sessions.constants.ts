import type { PaymentMode, SessionStatus } from '../../../database/database.types.js';
import type { SessionTransition } from '../types/session-transition.type.js';

export const SESSION_LABEL_MAX_LENGTH = 100;
export const SESSION_PAYER_NAME_MAX_LENGTH = 50;
export const SESSION_SHARE_TOKEN_LENGTH = 12;
export const SESSION_LIFETIME_DAYS = 30;

export const SESSION_STATUSES = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  ORDERED: 'ordered',
} as const satisfies Record<string, SessionStatus>;

export const SESSION_TRANSITIONS = {
  OPEN: { from: SESSION_STATUSES.DRAFT, to: SESSION_STATUSES.OPEN },
  CLOSE: { from: SESSION_STATUSES.OPEN, to: SESSION_STATUSES.CLOSED },
  REOPEN: { from: SESSION_STATUSES.CLOSED, to: SESSION_STATUSES.OPEN },
  MARK_ORDERED: { from: SESSION_STATUSES.CLOSED, to: SESSION_STATUSES.ORDERED },
} as const satisfies Record<string, SessionTransition>;

export const SESSION_STATUS_CHANGED_EVENT = 'session.status.changed';

export const PAYMENT_MODES = {
  EACH_PAYS: 'each_pays',
  EQUAL_SPLIT: 'equal_split',
  PAYER_OFFERS: 'payer_offers',
} as const satisfies Record<string, PaymentMode>;

export const SESSION_STATUS_MESSAGE = `$property must be one of ${Object.values(SESSION_STATUSES).join(', ')}`;
export const PAYMENT_MODE_MESSAGE = `$property must be one of ${Object.values(PAYMENT_MODES).join(', ')}`;

export const SESSIONS_ROUTE = 'sessions';
export const SESSIONS_TAG = 'Sessions';
export const SESSION_ID_PARAM = 'sessionId';
export const SESSION_ID_ROUTE = `:${SESSION_ID_PARAM}`;
export const SESSION_OPEN_ROUTE = `${SESSION_ID_ROUTE}/open`;
export const SESSION_CLOSE_ROUTE = `${SESSION_ID_ROUTE}/close`;
export const SESSION_REOPEN_ROUTE = `${SESSION_ID_ROUTE}/reopen`;
export const SESSION_MARK_ORDERED_ROUTE = `${SESSION_ID_ROUTE}/mark-ordered`;

export const SESSIONS_SWAGGER = {
  CREATE: 'Create a draft session on a restaurant',
  FIND_ALL: 'List my sessions (all sessions for an admin), optionally filtered by status',
  FIND_ONE: 'Get one of my sessions (any session for an admin)',
  UPDATE: 'Update one of my sessions (any session for an admin), refused once it is ordered',
  OPEN: 'Open a draft session, it needs at least one active dish or the free mode',
  CLOSE: 'Close an open session',
  REOPEN: 'Reopen a closed session, a new deadline is required once the deadline is past',
  MARK_ORDERED: 'Mark a closed session as ordered',
  INVALID_BODY: 'Invalid body',
  INVALID_QUERY: 'Invalid status',
  INVALID_ID_OR_BODY: 'Invalid session id or body',
  INVALID_ID: 'Invalid session id',
  INVALID_SCHEDULE: 'Deadline in the past or pickup before deadline',
  INVALID_REOPEN: 'Invalid session id or body, deadline required, in the past or before pickup',
  INVALID_OPEN: 'Invalid session id or deadline in the past',
  NOT_OWNER: 'This session belongs to another user and you are not an admin',
  SESSION_NOT_FOUND: 'Session not found',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
} as const satisfies Record<string, string>;
