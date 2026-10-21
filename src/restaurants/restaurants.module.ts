import { Module } from '@nestjs/common';
import { RestaurantsExceptions } from './_utils/exceptions/restaurants.exceptions.js';
import { RestaurantMapper } from './_utils/mappers/restaurant.mapper.js';
import { ParseRestaurantPipe } from './_utils/pipes/parse-restaurant.pipe.js';
import { RestaurantsController } from './restaurants.controller.js';
import { RestaurantsRepository } from './restaurants.repository.js';
import { RestaurantsService } from './restaurants.service.js';

@Module({
  controllers: [RestaurantsController],
  providers: [
    RestaurantsService,
    RestaurantsRepository,
    RestaurantsExceptions,
    RestaurantMapper,
    ParseRestaurantPipe,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
