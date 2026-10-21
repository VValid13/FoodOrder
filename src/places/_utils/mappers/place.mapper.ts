import { Injectable } from '@nestjs/common';
import type { Coordinates } from '../../../_utils/types/coordinates.type.js';
import { RESTAURANT_UNKNOWN_ADDRESS } from '../../../restaurants/_utils/constants/restaurants.constants.js';
import type { NewRestaurant } from '../../../restaurants/_utils/types/new-restaurant.type.js';
import type { OverpassElement } from '../types/overpass-element.type.js';
import { OpeningHoursMapper } from './opening-hours.mapper.js';

@Injectable()
export class PlaceMapper {
  constructor(private readonly openingHoursMapper: OpeningHoursMapper) {}

  toNewRestaurant(element: OverpassElement): NewRestaurant {
    const tags = element.tags ?? {};
    const coordinates = this.toCoordinates(element);

    return {
      values: {
        name: tags.name ?? RESTAURANT_UNKNOWN_ADDRESS,
        address: this.toAddress(tags, coordinates),
        phone: tags.phone ?? tags['contact:phone'] ?? null,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
        externalId: `${element.type}/${element.id}`,
      },
      openingHours: this.openingHoursMapper.toOpeningHours(tags.opening_hours, coordinates),
    };
  }

  private toCoordinates(element: OverpassElement): Coordinates | null {
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    return latitude !== undefined && longitude !== undefined ? { latitude, longitude } : null;
  }

  private toAddress(tags: Record<string, string>, coordinates: Coordinates | null): string {
    const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
    const city = [tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(' ');
    const address = [street, city].filter(Boolean).join(', ');
    if (address) {
      return address;
    }
    return coordinates
      ? `${coordinates.latitude}, ${coordinates.longitude}`
      : RESTAURANT_UNKNOWN_ADDRESS;
  }
}
