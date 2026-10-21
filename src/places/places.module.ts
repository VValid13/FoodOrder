import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../_utils/config/env.config.js';
import { ENV_KEYS } from '../_utils/constants/env.constants.js';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import {
  PLACES_REQUEST_TIMEOUT_MS,
  PLACES_USER_AGENT,
} from './_utils/constants/places.constants.js';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import { OpeningHoursMapper } from './_utils/mappers/opening-hours.mapper.js';
import { OverpassQueryMapper } from './_utils/mappers/overpass-query.mapper.js';
import { PlaceMapper } from './_utils/mappers/place.mapper.js';
import { PlacesController } from './places.controller.js';
import { PlacesRequests } from './places.requests.js';
import { PlacesService } from './places.service.js';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        baseURL: configService.getOrThrow(ENV_KEYS.PLACES_API_URL, { infer: true }),
        timeout: PLACES_REQUEST_TIMEOUT_MS,
        headers: { 'User-Agent': PLACES_USER_AGENT },
      }),
    }),
    RestaurantsModule,
  ],
  controllers: [PlacesController],
  providers: [
    PlacesService,
    PlacesRequests,
    PlacesExceptions,
    PlaceMapper,
    OverpassQueryMapper,
    OpeningHoursMapper,
  ],
})
export class PlacesModule {}
