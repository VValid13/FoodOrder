import { Injectable } from '@nestjs/common';
import { TIME_LENGTH } from '../constants/restaurants.constants.js';
import type { RestaurantResponseDto } from '../dtos/responses/restaurant.response.dto.js';
import type { RestaurantDetails } from '../types/restaurant-details.type.js';

@Injectable()
export class RestaurantMapper {
  toResponse(restaurant: RestaurantDetails): RestaurantResponseDto {
    return {
      id: restaurant.id,
      ownerId: restaurant.ownerId,
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      coordinates: restaurant.coordinates,
      timezone: restaurant.timezone,
      externalId: restaurant.externalId,
      menu: restaurant.menu,
      openingHours: restaurant.openingSlots.map((slot) => ({
        day: slot.dayOfWeek,
        open: slot.opensAt.slice(0, TIME_LENGTH),
        close: slot.closesAt.slice(0, TIME_LENGTH),
      })),
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }

  toResponseList = (restaurants: RestaurantDetails[]): RestaurantResponseDto[] =>
    restaurants.map((restaurant) => this.toResponse(restaurant));
}
