import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NOT_OWNER_MESSAGE } from '../constants/restaurants.constants.js';

@Injectable()
export class RestaurantsExceptions {
  invalidRestaurantId(restaurantId: string): BadRequestException {
    return new BadRequestException(`${restaurantId} is not a valid restaurant id`);
  }

  restaurantNotFound(restaurantId: string): NotFoundException {
    return new NotFoundException(`Restaurant ${restaurantId} not found`);
  }

  notOwner(): ForbiddenException {
    return new ForbiddenException(NOT_OWNER_MESSAGE);
  }

  usedBySession(restaurantId: string): ConflictException {
    return new ConflictException(`Restaurant ${restaurantId} is used by a session`);
  }

  alreadyImported(externalId: string): ConflictException {
    return new ConflictException(`Place ${externalId} is already imported`);
  }

  menuNotFound(menuId: string): NotFoundException {
    return new NotFoundException(`Menu ${menuId} not found`);
  }
}
