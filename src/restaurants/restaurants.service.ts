import { Injectable } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import type { CreateRestaurantDto } from './_utils/dtos/requests/create-restaurant.dto.js';
import type { UpdateRestaurantDto } from './_utils/dtos/requests/update-restaurant.dto.js';
import type { RestaurantResponseDto } from './_utils/dtos/responses/restaurant.response.dto.js';
import { RestaurantMapper } from './_utils/mappers/restaurant.mapper.js';
import type { NewRestaurant } from './_utils/types/new-restaurant.type.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import { RestaurantsRepository } from './restaurants.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantMapper: RestaurantMapper,
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    const restaurantId = await this.restaurantsRepository.createRestaurant(
      this.restaurantMapper.toNewRestaurant(createRestaurantDto),
    );
    return await this.findResponseById(restaurantId);
  }

  async findAllRestaurants(): Promise<RestaurantResponseDto[]> {
    const restaurants = await this.restaurantsRepository.findAllRestaurants();
    return this.restaurantMapper.toResponseList(restaurants);
  }

  findRestaurant(restaurant: RestaurantDetails): RestaurantResponseDto {
    return this.restaurantMapper.toResponse(restaurant);
  }

  async findRestaurantsByName(name: string): Promise<RestaurantResponseDto[]> {
    const restaurants = await this.restaurantsRepository.findRestaurantsByName(name);
    return this.restaurantMapper.toResponseList(restaurants);
  }

  async importRestaurants(newRestaurants: NewRestaurant[]): Promise<RestaurantResponseDto[]> {
    await this.restaurantsRepository.importRestaurants(newRestaurants);
    const externalIds = newRestaurants
      .map(({ values }) => values.externalId)
      .filter((externalId): externalId is string => typeof externalId === 'string');
    const restaurants = await this.restaurantsRepository.findRestaurantsByExternalIds(externalIds);
    return this.restaurantMapper.toResponseList(restaurants);
  }

  async updateRestaurant(
    restaurant: RestaurantDetails,
    { openingHours, ...updateRestaurantDto }: UpdateRestaurantDto,
  ): Promise<RestaurantResponseDto> {
    await this.restaurantsRepository.updateRestaurant(
      restaurant.id,
      this.restaurantMapper.toChanges(updateRestaurantDto),
      openingHours,
    );
    return await this.findResponseById(restaurant.id);
  }

  async deleteRestaurant(restaurant: RestaurantDetails): Promise<void> {
    await this.restaurantsRepository.deleteRestaurant(restaurant.id);
  }

  private async findResponseById(restaurantId: UUID): Promise<RestaurantResponseDto> {
    const restaurant = await this.restaurantsRepository.findRestaurantByIdOrFail(restaurantId);
    return this.restaurantMapper.toResponse(restaurant);
  }
}
