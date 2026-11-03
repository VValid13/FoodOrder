import { Injectable } from '@nestjs/common';
import { DAYS_OF_WEEK } from '../../../_utils/constants/day-of-week.constants.js';
import { DATABASE_TIME_FORMAT, END_OF_DAY } from '../../../_utils/constants/time.constants.js';
import { formatTime, parseTime } from '../../../_utils/helpers/parse-time.helper.js';
import type { Time } from '../../../_utils/types/time.type.js';
import type { CreateRestaurantDto } from '../dtos/requests/create-restaurant.dto.js';
import type { UpdateRestaurantDto } from '../dtos/requests/update-restaurant.dto.js';
import type { MenuResponseDto } from '../../../menus/_utils/dtos/responses/menu.response.dto.js';
import type { RestaurantResponseDto } from '../dtos/responses/restaurant.response.dto.js';
import type { RestaurantWithMenuResponseDto } from '../dtos/responses/restaurant-with-menu.response.dto.js';
import type { NewRestaurant } from '../types/new-restaurant.type.js';
import type { RestaurantDetails } from '../types/restaurant-details.type.js';
import type { RestaurantChanges } from '../types/restaurant-values.type.js';

@Injectable()
export class RestaurantMapper {
  toNewRestaurant({
    coordinates,
    openingHours = [],
    ...values
  }: CreateRestaurantDto): NewRestaurant {
    return {
      values: {
        ...values,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      },
      openingHours,
    };
  }

  toChanges({
    coordinates,
    ...changes
  }: Omit<UpdateRestaurantDto, 'openingHours'>): RestaurantChanges {
    if (coordinates === undefined) {
      return changes;
    }
    return {
      ...changes,
      latitude: coordinates?.latitude ?? null,
      longitude: coordinates?.longitude ?? null,
    };
  }

  toResponse(restaurant: RestaurantDetails): RestaurantResponseDto {
    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      phone: restaurant.phone,
      coordinates:
        restaurant.latitude !== null && restaurant.longitude !== null
          ? { latitude: restaurant.latitude, longitude: restaurant.longitude }
          : null,
      timezone: restaurant.timezone,
      externalId: restaurant.externalId,
      menu: restaurant.menu,
      openingHours: restaurant.openingSlots.map((slot) => ({
        day: DAYS_OF_WEEK[slot.dayOfWeek],
        open: this.toTime(slot.opensAt),
        close: this.toTime(slot.closesAt),
      })),
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }

  toResponseWithMenu(
    restaurant: RestaurantDetails,
    menu: MenuResponseDto | null,
  ): RestaurantWithMenuResponseDto {
    return { ...this.toResponse(restaurant), menu };
  }

  toResponseList = (restaurants: RestaurantDetails[]): RestaurantResponseDto[] =>
    restaurants.map((restaurant) => this.toResponse(restaurant));

  private toTime(databaseTime: string): Time {
    const time = parseTime(databaseTime, DATABASE_TIME_FORMAT);
    return time ? formatTime(time) : END_OF_DAY;
  }
}
