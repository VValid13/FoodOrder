import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../_utils/config/env.config.js';
import { ENV_KEYS } from '../_utils/constants/env.constants.js';
import {
  PLACES_LOGGER_CONTEXT,
  PLACES_REQUEST_TIMEOUT_MS,
  PLACES_USER_AGENT,
} from './_utils/constants/places.constants.js';
import { PlacesExceptions } from './_utils/exceptions/places.exceptions.js';
import type { OverpassElement, OverpassResponse } from './_utils/types/overpass-element.type.js';

@Injectable()
export class PlacesClient {
  private readonly logger = new Logger(PLACES_LOGGER_CONTEXT);

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly placesExceptions: PlacesExceptions,
  ) {}

  async query(query: string): Promise<OverpassElement[]> {
    try {
      const response = await fetch(
        this.configService.getOrThrow(ENV_KEYS.PLACES_API_URL, { infer: true }),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': PLACES_USER_AGENT,
          },
          body: new URLSearchParams({ data: query }),
          signal: AbortSignal.timeout(PLACES_REQUEST_TIMEOUT_MS),
        },
      );

      if (!response.ok) {
        this.logger.warn(`Places provider answered ${response.status}`);
        throw this.placesExceptions.unavailable();
      }

      const body = (await response.json()) as OverpassResponse;
      return body.elements;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.warn(
        `Places provider failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw this.placesExceptions.unavailable();
    }
  }
}
