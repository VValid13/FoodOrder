import { Module } from '@nestjs/common';
import { MenusModule } from '../menus/menus.module.js';
import { PlacesModule } from '../places/places.module.js';
import { RestaurantMapper } from './_utils/mappers/restaurant.mapper.js';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsRepository } from './restaurants.repository.js';
import { RestaurantsService } from './restaurants.service.js';

@Module({
  imports: [PlacesModule, MenusModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsRepository, RestaurantMapper],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
