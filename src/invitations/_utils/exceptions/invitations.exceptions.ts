import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const SESSION_NOT_INVITABLE_MESSAGE = 'SESSION_NOT_INVITABLE';
export const PARTICIPANTS_LIMIT_REACHED_MESSAGE = 'PARTICIPANTS_LIMIT_REACHED';
export const CONTACT_LIST_EMPTY_MESSAGE = 'CONTACT_LIST_EMPTY';
export const PARTICIPANT_NOT_FOUND_MESSAGE = 'PARTICIPANT_NOT_FOUND';
export const INVALID_INVITATION_LINK_MESSAGE = 'INVALID_INVITATION_LINK';
export const PUBLIC_LINK_NOT_FOUND_MESSAGE = 'PUBLIC_LINK_NOT_FOUND';
export const SESSION_NOT_OPEN_MESSAGE = 'SESSION_NOT_OPEN';
export const NAME_TAKEN_MESSAGE = 'NAME_TAKEN';
export const PARTICIPANT_ALREADY_LINKED_MESSAGE = 'PARTICIPANT_ALREADY_LINKED';

@Injectable()
export class InvitationsExceptions {
  readonly sessionNotInvitable = new ConflictException(SESSION_NOT_INVITABLE_MESSAGE);
  readonly participantsLimitReached = new ConflictException(PARTICIPANTS_LIMIT_REACHED_MESSAGE);
  readonly contactListEmpty = new UnprocessableEntityException(CONTACT_LIST_EMPTY_MESSAGE);
  readonly participantNotFound = new NotFoundException(PARTICIPANT_NOT_FOUND_MESSAGE);
  readonly invalidInvitationLink = new UnauthorizedException(INVALID_INVITATION_LINK_MESSAGE);
  readonly publicLinkNotFound = new NotFoundException(PUBLIC_LINK_NOT_FOUND_MESSAGE);
  readonly sessionNotOpen = new ConflictException(SESSION_NOT_OPEN_MESSAGE);
  readonly nameTaken = new ConflictException(NAME_TAKEN_MESSAGE);
  readonly participantAlreadyLinked = new ConflictException(PARTICIPANT_ALREADY_LINKED_MESSAGE);
}
