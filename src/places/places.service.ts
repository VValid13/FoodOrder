import { Injectable } from '@nestjs/common';
import type { Coordinates } from '../_utils/types/coordinates.type.js';
import type { NewRestaurant } from '../restaurants/_utils/types/new-restaurant.type.js';
import { OpeningHoursMapper } from './_utils/mappers/opening-hours.mapper.js';
import { OverpassQueryMapper } from './_utils/mappers/overpass-query.mapper.js';
import { PlaceMapper } from './_utils/mappers/place.mapper.js';
import { PlacesRequests } from './places.requests.js';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRequests: PlacesRequests,
    private readonly placeMapper: PlaceMapper,
    private readonly openingHoursMapper: OpeningHoursMapper,
    private readonly overpassQueryMapper: OverpassQueryMapper,
  ) {}

  async searchAround(name: string, coordinates: Coordinates): Promise<NewRestaurant[]> {
    const elements = await this.placesRequests.runQuery(
      this.overpassQueryMapper.toSearchQuery(name, coordinates),
    );

    return elements.map((element) => {
      const openingHours = this.openingHoursMapper.toOpeningDays(
        element.tags?.opening_hours,
        this.placeMapper.toCoordinates(element),
      );
      return this.placeMapper.toNewRestaurant(element, openingHours);
    });
  }
}
