import { Injectable } from '@nestjs/common';
import type { PlaceResponseDto } from './_utils/dtos/responses/place.response.dto.js';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import {
  buildLookupQuery,
  buildSearchQuery,
} from './_utils/helpers/build-overpass-query.helper.js';
import { PlaceMapper } from './_utils/mappers/place.mapper.js';
import type { Place } from './_utils/types/place.type.js';
import type { SearchAround } from './_utils/types/search-around.type.js';
import { PlacesClient } from './places.client.js';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesClient: PlacesClient,
    private readonly placeMapper: PlaceMapper,
    private readonly placesExceptions: PlacesExceptions,
  ) {}

  async searchAround(searchAround: SearchAround): Promise<PlaceResponseDto[]> {
    const elements = await this.placesClient.query(buildSearchQuery(searchAround));
    return this.placeMapper.toResponseList(
      elements.map((element) => this.placeMapper.toPlace(element)),
    );
  }

  async findByExternalIdOrFail(externalId: string): Promise<Place> {
    const [element] = await this.placesClient.query(buildLookupQuery(externalId));
    if (!element?.tags?.name) {
      throw this.placesExceptions.placeNotFound(externalId);
    }
    return this.placeMapper.toPlace(element);
  }
}
