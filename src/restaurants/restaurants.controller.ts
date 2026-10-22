import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import {
  RESTAURANT_ID_PARAM,
  RESTAURANT_ID_ROUTE,
  RESTAURANTS_ROUTE,
  RESTAURANTS_TAG,
} from './_utils/constants/restaurants.constants.js';
import { PLACES_UNAVAILABLE_MESSAGE } from '../places/_utils/exceptions/places.exceptions.js';
import { CreateRestaurantDto } from './_utils/dtos/requests/create-restaurant.dto.js';
import { FindRestaurantsDto } from './_utils/dtos/requests/find-restaurants.dto.js';
import { UpdateRestaurantDto } from './_utils/dtos/requests/update-restaurant.dto.js';
import { RestaurantResponseDto } from './_utils/dtos/responses/restaurant.response.dto.js';
import { ParseRestaurantPipe } from './_utils/pipes/parse-restaurant.pipe.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import { RestaurantsService } from './restaurants.service.js';

@ApiTags(RESTAURANTS_TAG)
@Controller(RESTAURANTS_ROUTE)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Protect()
  @Post()
  @ApiOperation({ summary: 'Create a restaurant' })
  @ApiCreatedResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid body or opening hours' })
  @ApiConflictResponse({ description: 'Menu does not exist' })
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.createRestaurant(createRestaurantDto);
  }

  @Protect()
  @Get()
  @ApiOperation({
    summary:
      'List restaurants, or search by name then on OpenStreetMap around lat/lon if none is known',
  })
  @ApiOkResponse({ type: [RestaurantResponseDto] })
  @ApiBadRequestResponse({ description: 'Invalid name, lat or lon' })
  @ApiBadGatewayResponse({ description: PLACES_UNAVAILABLE_MESSAGE })
  async findRestaurants(
    @Query() findRestaurantsDto: FindRestaurantsDto,
  ): Promise<RestaurantResponseDto[]> {
    return await this.restaurantsService.findRestaurants(findRestaurantsDto);
  }

  @Protect()
  @Get(RESTAURANT_ID_ROUTE)
  @ApiOperation({ summary: 'Get a restaurant with its menu' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  findRestaurant(
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
  ): RestaurantResponseDto {
    return this.restaurantsService.findRestaurant(restaurant);
  }

  @Protect()
  @Patch(RESTAURANT_ID_ROUTE)
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id, body or opening hours' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiConflictResponse({ description: 'Menu does not exist' })
  async updateRestaurant(
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.updateRestaurant(restaurant, updateRestaurantDto);
  }

  @Protect()
  @Delete(RESTAURANT_ID_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: 'Restaurant deleted' })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiConflictResponse({ description: 'Restaurant used by a session' })
  async deleteRestaurant(
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
  ): Promise<void> {
    await this.restaurantsService.deleteRestaurant(restaurant);
  }
}
