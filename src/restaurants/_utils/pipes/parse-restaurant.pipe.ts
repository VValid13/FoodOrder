import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';
import type { UUID } from 'node:crypto';
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
    if (!isUUID(value)) {
      throw this.restaurantsExceptions.invalidRestaurantId(value);
    }
    return await this.restaurantsRepository.findDetailsByIdOrFail(value as UUID);
  }
}
