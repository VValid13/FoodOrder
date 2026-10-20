import { Injectable } from '@nestjs/common';
import { parseOpeningHours } from '../helpers/parse-opening-hours.helper.js';
import type { PlaceResponseDto } from '../dtos/responses/place.response.dto.js';
import type { OverpassElement } from '../types/overpass-element.type.js';
import type { Place } from '../types/place.type.js';

@Injectable()
export class PlaceMapper {
  toPlace(element: OverpassElement): Place {
    const tags = element.tags ?? {};
    const lat = element.lat ?? element.center?.lat;
    const lon = element.lon ?? element.center?.lon;
    const street = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
    const city = [tags['addr:postcode'], tags['addr:city']].filter(Boolean).join(' ');
    const address = [street, city].filter(Boolean).join(', ');

    return {
      externalId: `${element.type}/${element.id}`,
      name: tags.name ?? '',
      address: address || null,
      phone: tags.phone ?? tags['contact:phone'] ?? null,
      coordinates: lat !== undefined && lon !== undefined ? `${lat},${lon}` : null,
      cuisine: tags.cuisine ?? null,
      openingHours: parseOpeningHours(tags.opening_hours) ?? [],
      openingHoursText: tags.opening_hours ?? null,
    };
  }

  toResponse(place: Place): PlaceResponseDto {
    return {
      externalId: place.externalId,
      name: place.name,
      address: place.address,
      phone: place.phone,
      coordinates: place.coordinates,
      cuisine: place.cuisine,
      openingHours: place.openingHours,
      openingHoursText: place.openingHoursText,
    };
  }

  toResponseList = (places: Place[]): PlaceResponseDto[] =>
    places.map((place) => this.toResponse(place));
}
