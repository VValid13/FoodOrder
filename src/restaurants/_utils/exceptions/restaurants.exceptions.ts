import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantsExceptions {
  invalidRestaurantId(restaurantId: string): BadRequestException {
    return new BadRequestException(`${restaurantId} is not a valid restaurant id`);
  }
}
