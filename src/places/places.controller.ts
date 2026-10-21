import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { RestaurantResponseDto } from '../restaurants/_utils/dtos/responses/restaurant.response.dto.js';
import { PLACES_ROUTE, PLACES_TAG } from './_utils/constants/places.constants.js';
import { SearchPlacesDto } from './_utils/dtos/requests/search-places.dto.js';
import { PLACES_UNAVAILABLE_MESSAGE } from './_utils/exceptions/places.exceptions.js';
import { PlacesService } from './places.service.js';

@ApiTags(PLACES_TAG)
@Controller(PLACES_ROUTE)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Protect()
  @Get()
  @ApiOperation({
    summary: 'Search restaurants by name, then on OpenStreetMap around lat/lon if none is known',
  })
  @ApiOkResponse({ type: [RestaurantResponseDto] })
  @ApiBadRequestResponse({ description: 'Invalid name, lat or lon' })
  @ApiBadGatewayResponse({ description: PLACES_UNAVAILABLE_MESSAGE })
  async searchPlaces(@Query() searchPlacesDto: SearchPlacesDto): Promise<RestaurantResponseDto[]> {
    return await this.placesService.searchPlaces(searchPlacesDto);
  }
}
