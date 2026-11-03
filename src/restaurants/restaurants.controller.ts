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
import type { Selectable } from 'kysely';
import { USER_ROLES } from '../_utils/constants/user-role.constants.js';
import { getEntityByIdPipe } from '../_utils/pipes/get-entity-by-id.pipe.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import type { Restaurant } from '../database/database.types.js';
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
import { RestaurantWithMenuResponseDto } from './_utils/dtos/responses/restaurant-with-menu.response.dto.js';
import { RestaurantsService } from './restaurants.service.js';

@ApiTags(RESTAURANTS_TAG)
@Controller(RESTAURANTS_ROUTE)
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Protect({ roles: [USER_ROLES.ADMIN] })
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
  @ApiOkResponse({ type: RestaurantWithMenuResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  async findRestaurant(
    @Param(RESTAURANT_ID_PARAM, getEntityByIdPipe('restaurant')) restaurant: Selectable<Restaurant>,
  ): Promise<RestaurantWithMenuResponseDto> {
    return await this.restaurantsService.findRestaurant(restaurant);
  }

  @Protect({ roles: [USER_ROLES.ADMIN] })
  @Patch(RESTAURANT_ID_ROUTE)
  @ApiOperation({ summary: 'Update a restaurant' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id, body or opening hours' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiConflictResponse({ description: 'Menu does not exist' })
  async updateRestaurant(
    @Param(RESTAURANT_ID_PARAM, getEntityByIdPipe('restaurant')) restaurant: Selectable<Restaurant>,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.updateRestaurant(restaurant, updateRestaurantDto);
  }

  @Protect({ roles: [USER_ROLES.ADMIN] })
  @Delete(RESTAURANT_ID_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: 'Restaurant deleted' })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiConflictResponse({ description: 'Restaurant used by a session' })
  async deleteRestaurant(
    @Param(RESTAURANT_ID_PARAM, getEntityByIdPipe('restaurant')) restaurant: Selectable<Restaurant>,
  ): Promise<void> {
    await this.restaurantsService.deleteRestaurant(restaurant);
  }
}
