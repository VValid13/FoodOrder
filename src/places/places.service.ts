import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import type { RestaurantResponseDto } from '../restaurants/_utils/dtos/responses/restaurant.response.dto.js';
import { RestaurantsService } from '../restaurants/restaurants.service.js';
import { PLACES_LOGGER_CONTEXT } from './_utils/constants/places.constants.js';
import type { SearchPlacesDto } from './_utils/dtos/requests/search-places.dto.js';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import { OverpassQueryMapper } from './_utils/mappers/overpass-query.mapper.js';
import { PlaceMapper } from './_utils/mappers/place.mapper.js';
import type { OverpassElement } from './_utils/types/overpass-element.type.js';
import { PlacesRequests } from './places.requests.js';

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PLACES_LOGGER_CONTEXT);

  constructor(
    private readonly placesRequests: PlacesRequests,
    private readonly placeMapper: PlaceMapper,
    private readonly overpassQueryMapper: OverpassQueryMapper,
    private readonly placesExceptions: PlacesExceptions,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async searchPlaces({ name, lat, lon }: SearchPlacesDto): Promise<RestaurantResponseDto[]> {
    const knownRestaurants = await this.restaurantsService.findRestaurantsByName(name);
    if (knownRestaurants.length > 0 || lat === undefined || lon === undefined) {
      return knownRestaurants;
    }

    const elements = await this.findOnOverpass(
      this.overpassQueryMapper.toSearchQuery(name, { latitude: lat, longitude: lon }),
    );
    return await this.restaurantsService.importRestaurants(
      elements.map((element) => this.placeMapper.toNewRestaurant(element)),
    );
  }

  private async findOnOverpass(query: string): Promise<OverpassElement[]> {
    try {
      return await this.placesRequests.runQuery(query);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }
      this.logger.warn(`Places provider failed: ${error.response?.status ?? error.code}`);
      throw this.placesExceptions.unavailable;
    }
  }
}
