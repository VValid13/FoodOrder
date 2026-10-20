import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import {
  PLACES_ROUTE,
  PLACES_TAG,
  PLACES_UNAVAILABLE_MESSAGE,
} from './_utils/constants/places.constants.js';
import { SearchPlacesDto } from './_utils/dtos/requests/search-places.dto.js';
import { PlaceResponseDto } from './_utils/dtos/responses/place.response.dto.js';
import { PlacesService } from './places.service.js';

@ApiTags(PLACES_TAG)
@Controller(PLACES_ROUTE)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Search restaurants around a point on OpenStreetMap' })
  @ApiOkResponse({ type: [PlaceResponseDto] })
  @ApiBadRequestResponse({ description: 'Invalid lat, lon, radius or name' })
  @ApiBadGatewayResponse({ description: PLACES_UNAVAILABLE_MESSAGE })
  async search(@Query() searchPlacesDto: SearchPlacesDto): Promise<PlaceResponseDto[]> {
    return await this.placesService.searchAround(searchPlacesDto);
  }
}
