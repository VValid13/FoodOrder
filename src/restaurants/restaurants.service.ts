import { Injectable } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { MenusService } from '../menus/menus.service.js';
import { PlacesService } from '../places/places.service.js';
import type { CreateRestaurantDto } from './_utils/dtos/requests/create-restaurant.dto.js';
import type { FindRestaurantsDto } from './_utils/dtos/requests/find-restaurants.dto.js';
import type { UpdateRestaurantDto } from './_utils/dtos/requests/update-restaurant.dto.js';
import type { RestaurantResponseDto } from './_utils/dtos/responses/restaurant.response.dto.js';
import type { RestaurantWithMenuResponseDto } from './_utils/dtos/responses/restaurant-with-menu.response.dto.js';
import { RestaurantMapper } from './_utils/mappers/restaurant.mapper.js';
import type { NewRestaurant } from './_utils/types/new-restaurant.type.js';
import type { RestaurantDetails } from './_utils/types/restaurant-details.type.js';
import { RestaurantsRepository } from './restaurants.repository.js';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantsRepository: RestaurantsRepository,
    private readonly restaurantMapper: RestaurantMapper,
    private readonly placesService: PlacesService,
    private readonly menusService: MenusService,
  ) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    const restaurantId = await this.restaurantsRepository.createRestaurant(
      this.restaurantMapper.toNewRestaurant(createRestaurantDto),
    );
    return await this.findResponseById(restaurantId);
  }

  async findRestaurants({ name, lat, lon }: FindRestaurantsDto): Promise<RestaurantResponseDto[]> {
    if (!name) {
      return this.restaurantMapper.toResponseList(
        await this.restaurantsRepository.findAllRestaurants(),
      );
    }

    const knownRestaurants = await this.restaurantsRepository.findRestaurantsByName(name);
    if (knownRestaurants.length > 0 || lat === undefined || lon === undefined) {
      return this.restaurantMapper.toResponseList(knownRestaurants);
    }

    return await this.importRestaurants(
      await this.placesService.searchAround(name, { latitude: lat, longitude: lon }),
    );
  }

  async findRestaurant(restaurant: RestaurantDetails): Promise<RestaurantWithMenuResponseDto> {
    const menu = restaurant.menuId ? await this.menusService.findMenuById(restaurant.menuId) : null;
    return this.restaurantMapper.toResponseWithMenu(restaurant, menu);
  }

  private async importRestaurants(
    newRestaurants: NewRestaurant[],
  ): Promise<RestaurantResponseDto[]> {
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
