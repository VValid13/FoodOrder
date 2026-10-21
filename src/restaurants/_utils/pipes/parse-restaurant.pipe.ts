import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { isUuid } from '../../../_utils/helpers/is-uuid.helper.js';
import { RestaurantsRepository } from '../../restaurants.repository.js';
import { RestaurantsExceptions } from '../exceptions/restaurants.exceptions.js';
import type { RestaurantDetails } from '../types/restaurant-details.type.js';

@Injectable()
export class ParseRestaurantPipe implements PipeTransform<string, Promise<RestaurantDetails>> {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantsExceptions: RestaurantsExceptions,
  ) {}

  async transform(value: string): Promise<RestaurantDetails> {
    if (!isUuid(value)) {
      throw this.restaurantsExceptions.invalidRestaurantId(value);
    }
    return await this.restaurantsRepository.findRestaurantByIdOrFail(value);
  }
}
