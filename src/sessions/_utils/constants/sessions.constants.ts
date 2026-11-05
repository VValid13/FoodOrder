import type { PaymentMode, SessionStatus } from '../../../database/database.types.js';

export const SESSION_LABEL_MAX_LENGTH = 100;
export const SESSION_PAYER_NAME_MAX_LENGTH = 50;
export const SESSION_SLUG_LENGTH = 12;
export const SESSION_LIFETIME_DAYS = 30;

export const SESSION_STATUSES = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  ORDERED: 'ordered',
} as const satisfies Record<string, SessionStatus>;

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

export const SESSIONS_SWAGGER = {
  CREATE: 'Create a draft session on a restaurant',
  FIND_ALL: 'List my sessions, optionally filtered by status',
  FIND_ONE: 'Get one of my sessions',
  UPDATE: 'Update one of my sessions, refused once it is ordered',
  INVALID_BODY: 'Invalid body',
  INVALID_QUERY: 'Invalid status',
  INVALID_ID_OR_BODY: 'Invalid session id or body',
  INVALID_ID: 'Invalid session id',
  INVALID_SCHEDULE: 'Deadline in the past or pickup before deadline',
  NOT_OWNER: 'This session belongs to another user',
  SESSION_NOT_FOUND: 'Session not found',
  RESTAURANT_NOT_FOUND: 'Restaurant not found',
} as const satisfies Record<string, string>;
