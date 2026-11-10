import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

export const RESTAURANT_CLOSED_MESSAGE = 'RESTAURANT_CLOSED';
export const DEADLINE_IN_PAST_MESSAGE = 'SESSION_DEADLINE_IN_PAST';
export const PICKUP_BEFORE_DEADLINE_MESSAGE = 'SESSION_PICKUP_BEFORE_DEADLINE';
export const SESSION_ALREADY_ORDERED_MESSAGE = 'SESSION_ALREADY_ORDERED';
export const SESSION_ACCESS_FORBIDDEN_MESSAGE = 'SESSION_ACCESS_FORBIDDEN';
export const INVALID_TRANSITION_MESSAGE = 'INVALID_TRANSITION';
export const SESSION_EMPTY_MENU_MESSAGE = 'SESSION_EMPTY_MENU';

@Injectable()
export class SessionsExceptions {
  readonly restaurantClosed = new UnprocessableEntityException(RESTAURANT_CLOSED_MESSAGE);
  readonly deadlineInPast = new BadRequestException(DEADLINE_IN_PAST_MESSAGE);
  readonly pickupBeforeDeadline = new BadRequestException(PICKUP_BEFORE_DEADLINE_MESSAGE);
  readonly alreadyOrdered = new ConflictException(SESSION_ALREADY_ORDERED_MESSAGE);
  readonly accessForbidden = new ForbiddenException(SESSION_ACCESS_FORBIDDEN_MESSAGE);
  readonly invalidTransition = new ConflictException(INVALID_TRANSITION_MESSAGE);
  readonly emptyMenu = new UnprocessableEntityException(SESSION_EMPTY_MENU_MESSAGE);
}
