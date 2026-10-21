import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';
import {
  OVERPASS_INTERPRETER_PATH,
  PLACES_LOGGER_CONTEXT,
} from './_utils/constants/places.constants.js';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import type { OverpassResponse } from './_utils/types/overpass-element.type.js';

@Injectable()
export class PlacesRequests {
  private readonly logger = new Logger(PLACES_LOGGER_CONTEXT);

  constructor(
    private readonly httpService: HttpService,
    private readonly placesExceptions: PlacesExceptions,
  ) {}

  runQuery = (query: string) =>
    this.httpService.axiosRef
      .post<OverpassResponse>(OVERPASS_INTERPRETER_PATH, new URLSearchParams({ data: query }))
      .then((r) => r.data.elements)
      .catch((error: unknown) => {
        if (!isAxiosError(error)) {
          throw error;
        }
        this.logger.warn(`Places provider failed: ${error.response?.status ?? error.code}`);
        throw this.placesExceptions.unavailable;
      });
}
