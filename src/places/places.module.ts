import { Module } from '@nestjs/common';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import { PlaceMapper } from './_utils/mappers/place.mapper.js';
import { PlacesClient } from './places.client.js';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesClient, PlacesExceptions, PlaceMapper],
  exports: [PlacesService],
})
export class PlacesModule {}
