import { Injectable } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { PlacesService } from '../places/places.service.js';
import type { UserEntity } from '../users/users.entity.js';
import { RESTAURANT_UNKNOWN_ADDRESS } from './_utils/constants/restaurants.constants.js';
import type { CreateRestaurantDto } from './_utils/dtos/requests/create-restaurant.dto.js';
import type { ImportRestaurantDto } from './_utils/dtos/requests/import-restaurant.dto.js';
import type { UpdateRestaurantDto } from './_utils/dtos/requests/update-restaurant.dto.js';
import type { RestaurantResponseDto } from './_utils/dtos/responses/restaurant.response.dto.js';
import { RestaurantsExceptions } from './_utils/exceptions/restaurants.exceptions.js';
import { RestaurantMapper } from './_utils/mappers/restaurant.mapper.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import { RestaurantsRepository } from './restaurants.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantsExceptions: RestaurantsExceptions,
    private readonly restaurantMapper: RestaurantMapper,
    private readonly placesService: PlacesService,
  ) {}

  async create(
    user: UserEntity,
    { openingHours = [], ...values }: CreateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    await this.ensureMenuExists(values.menuId);
    const restaurantId = await this.restaurantsRepository.create(user.id, values, openingHours);
    return await this.findResponseById(restaurantId);
  }

  async importFromPlace(
    user: UserEntity,
    { externalId }: ImportRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    if (await this.restaurantsRepository.existsByOwnerAndExternalId(user.id, externalId)) {
      throw this.restaurantsExceptions.alreadyImported(externalId);
    }

    const place = await this.placesService.findByExternalIdOrFail(externalId);
    const restaurantId = await this.restaurantsRepository.create(
      user.id,
      {
        name: place.name,
        address: place.address ?? place.coordinates ?? RESTAURANT_UNKNOWN_ADDRESS,
        phone: place.phone,
        coordinates: place.coordinates,
        externalId: place.externalId,
      },
      place.openingHours,
    );
    return await this.findResponseById(restaurantId);
  }

  async findAllMine(user: UserEntity): Promise<RestaurantResponseDto[]> {
    const restaurants = await this.restaurantsRepository.findAllDetailsByOwner(user.id);
    return this.restaurantMapper.toResponseList(restaurants);
  }

  findOne(user: UserEntity, restaurant: RestaurantDetails): RestaurantResponseDto {
    this.ensureOwner(user, restaurant);
    return this.restaurantMapper.toResponse(restaurant);
  }

  async update(
    user: UserEntity,
    restaurant: RestaurantDetails,
    { openingHours, ...changes }: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    this.ensureOwner(user, restaurant);
    await this.ensureMenuExists(changes.menuId);
    await this.restaurantsRepository.update(restaurant.id, changes, openingHours);
    return await this.findResponseById(restaurant.id);
  }

  async delete(user: UserEntity, restaurant: RestaurantDetails): Promise<void> {
    this.ensureOwner(user, restaurant);
    if (await this.restaurantsRepository.isUsedBySession(restaurant.id)) {
      throw this.restaurantsExceptions.usedBySession(restaurant.id);
    }
    await this.restaurantsRepository.delete(restaurant.id);
  }

  private ensureOwner(user: UserEntity, restaurant: RestaurantDetails): void {
    if (restaurant.ownerId !== user.id) {
      throw this.restaurantsExceptions.notOwner();
    }
  }

  private async ensureMenuExists(menuId: UUID | null | undefined): Promise<void> {
    if (menuId && !(await this.restaurantsRepository.menuExists(menuId))) {
      throw this.restaurantsExceptions.menuNotFound(menuId);
    }
  }

  private async findResponseById(restaurantId: UUID): Promise<RestaurantResponseDto> {
    const restaurant = await this.restaurantsRepository.findDetailsByIdOrFail(restaurantId);
    return this.restaurantMapper.toResponse(restaurant);
  }
}
