import type { ParticipantStatus, SessionStatus } from '../../../database/database.types.js';
import {
  SESSION_ID_ROUTE,
  SESSION_STATUSES,
} from '../../../sessions/_utils/constants/sessions.constants.js';

export const INVITATION_TOKEN_BYTES = 32;
export const MAX_PARTICIPANTS_PER_SESSION = 50;
export const PARTICIPANT_NAME_MAX_LENGTH = 50;

export const PARTICIPANT_STATUSES = {
  INVITED: 'invited',
  SEEN: 'seen',
  IN_PROGRESS: 'in_progress',
  VALIDATED: 'validated',
  MODIFIED: 'modified',
  CANCELLED: 'cancelled',
} as const satisfies Record<string, ParticipantStatus>;

export const INVITABLE_SESSION_STATUSES: readonly SessionStatus[] = [
  SESSION_STATUSES.DRAFT,
  SESSION_STATUSES.OPEN,
];

export const INVITATION_TOKEN_HEADER = 'x-invitation-token';

export const INVITATIONS_TAG = 'Invitations';
export const MY_INVITATION_ROUTE = 'invitations/me';
export const LINK_ACCOUNT_ROUTE = 'link-account';
export const MY_INVITATIONS_ROUTE = 'users/me/invitations';
export const PUBLIC_LINKS_ROUTE = 'public-links';
export const SHARE_TOKEN_PARAM = 'shareToken';
export const PUBLIC_LINK_JOIN_ROUTE = `:${SHARE_TOKEN_PARAM}/join`;
export const PARTICIPANT_ID_PARAM = 'participantId';
export const CONTACT_LIST_ID_PARAM = 'contactListId';
export const SESSION_INVITATIONS_ROUTE = `${SESSION_ID_ROUTE}/invitations`;
export const SESSION_CONTACT_LIST_INVITATIONS_ROUTE = `${SESSION_INVITATIONS_ROUTE}/contact-lists/:${CONTACT_LIST_ID_PARAM}`;
export const SESSION_PARTICIPANT_LINK_ROUTE = `${SESSION_ID_ROUTE}/participants/:${PARTICIPANT_ID_PARAM}/link`;

export const INVITATIONS_SWAGGER = {
  CREATE: 'Invite people by names, each one gets a personal link shown only once',
  CREATE_FROM_CONTACT_LIST:
    'Invite the members of one of my contact lists, each one gets a personal link shown only once',
  REGENERATE_LINK: 'Regenerate the personal link of a participant, the old one stops working',
  REVOKE_LINK: 'Revoke the personal link of a participant, the participant stays in the session',
  LINK_REVOKED: 'Link revoked',
  FIND_MY_INVITATION:
    'Get my session, its restaurant with the menu and my participant, the first call marks me as seen',
  INVITATION_TOKEN: 'Personal invitation token',
  JOIN_PUBLIC_LINK:
    'Join an open session through its public link with a name, returns a personal link shown only once',
  JOIN_CONFLICT: 'Session is not open, the name is taken or the participants limit is reached',
  LINK_ACCOUNT: 'Link my participant to my connected account',
  FIND_MY_INVITATIONS: 'List the sessions I am a participant of',
  INVALID_BODY: 'Invalid body',
  INVALID_ID_OR_BODY: 'Invalid session id or body',
  INVALID_IDS: 'Invalid session id or participant id',
  INVALID_CONTACT_LIST_IDS: 'Invalid session id or contact list id',
  PARTICIPANT_NOT_FOUND: 'Session or participant not found',
  SESSION_OR_CONTACT_LIST_NOT_FOUND: 'Session or contact list not found',
  CONFLICT: 'Session is not draft or open, or the participants limit is reached',
  TOKEN: 'Personal invitation token, shown only once',
  SKIPPED_NAMES: 'Names already taken in the session',
} as const satisfies Record<string, string>;
