import { Injectable } from '@nestjs/common';
import type { Coordinates } from '../../../_utils/types/coordinates.type.js';
import {
  PLACES_AMENITY_PATTERN,
  PLACES_QUERY_TIMEOUT_SECONDS,
  PLACES_SEARCH_LIMIT,
  PLACES_SEARCH_RADIUS_METERS,
} from '../constants/places.constants.js';

@Injectable()
export class OverpassQueryMapper {
  private readonly header = `[out:json][timeout:${PLACES_QUERY_TIMEOUT_SECONDS}];`;
  private readonly amenityFilter = `["amenity"~"${PLACES_AMENITY_PATTERN}"]`;
  private readonly output = `out center tags ${PLACES_SEARCH_LIMIT};`;

  toSearchQuery(name: string, { latitude, longitude }: Coordinates): string {
    const nameFilter = `["name"~"${name}",i]`;
    const area = `(around:${PLACES_SEARCH_RADIUS_METERS},${latitude},${longitude})`;
    return `${this.header}nwr${this.amenityFilter}${nameFilter}${area};${this.output}`;
  }
}
