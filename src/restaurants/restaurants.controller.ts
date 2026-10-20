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
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/_utils/decorators/current-user.decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { PLACES_UNAVAILABLE_MESSAGE } from '../places/_utils/constants/places.constants.js';
import type { UserEntity } from '../users/users.entity.js';
import {
  IMPORT_ROUTE,
  NOT_OWNER_MESSAGE,
  RESTAURANT_ID_PARAM,
  RESTAURANT_ID_ROUTE,
  RESTAURANTS_ROUTE,
  RESTAURANTS_TAG,
} from './_utils/constants/restaurants.constants.js';
import { CreateRestaurantDto } from './_utils/dtos/requests/create-restaurant.dto.js';
import { ImportRestaurantDto } from './_utils/dtos/requests/import-restaurant.dto.js';
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
  @ApiNotFoundResponse({ description: 'Menu not found' })
  async create(
    @CurrentUser() user: UserEntity,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.create(user, createRestaurantDto);
  }

  @Protect()
  @Post(IMPORT_ROUTE)
  @ApiOperation({ summary: 'Import a restaurant from OpenStreetMap' })
  @ApiCreatedResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid externalId' })
  @ApiNotFoundResponse({ description: 'Place not found or not a restaurant' })
  @ApiConflictResponse({ description: 'Place already imported' })
  @ApiBadGatewayResponse({ description: PLACES_UNAVAILABLE_MESSAGE })
  async import(
    @CurrentUser() user: UserEntity,
    @Body() importRestaurantDto: ImportRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.importFromPlace(user, importRestaurantDto);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'List my restaurants' })
  @ApiOkResponse({ type: [RestaurantResponseDto] })
  async findAllMine(@CurrentUser() user: UserEntity): Promise<RestaurantResponseDto[]> {
    return await this.restaurantsService.findAllMine(user);
  }

  @Protect()
  @Get(RESTAURANT_ID_ROUTE)
  @ApiOperation({ summary: 'Get one of my restaurants with its menu' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiForbiddenResponse({ description: NOT_OWNER_MESSAGE })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  findOne(
    @CurrentUser() user: UserEntity,
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
  ): RestaurantResponseDto {
    return this.restaurantsService.findOne(user, restaurant);
  }

  @Protect()
  @Patch(RESTAURANT_ID_ROUTE)
  @ApiOperation({ summary: 'Update one of my restaurants' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: RestaurantResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id, body or opening hours' })
  @ApiForbiddenResponse({ description: NOT_OWNER_MESSAGE })
  @ApiNotFoundResponse({ description: 'Restaurant or menu not found' })
  async update(
    @CurrentUser() user: UserEntity,
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    return await this.restaurantsService.update(user, restaurant, updateRestaurantDto);
  }

  @Protect()
  @Delete(RESTAURANT_ID_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete one of my restaurants' })
  @ApiParam({ name: RESTAURANT_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: 'Restaurant deleted' })
  @ApiBadRequestResponse({ description: 'Invalid restaurant id' })
  @ApiForbiddenResponse({ description: NOT_OWNER_MESSAGE })
  @ApiNotFoundResponse({ description: 'Restaurant not found' })
  @ApiConflictResponse({ description: 'Restaurant used by a session' })
  async delete(
    @CurrentUser() user: UserEntity,
    @Param(RESTAURANT_ID_PARAM, ParseRestaurantPipe) restaurant: RestaurantDetails,
  ): Promise<void> {
    await this.restaurantsService.delete(user, restaurant);
  }
}
