import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { PLACES_UNAVAILABLE_MESSAGE } from '../constants/places.constants.js';

@Injectable()
export class PlacesExceptions {
  unavailable(): BadGatewayException {
    return new BadGatewayException(PLACES_UNAVAILABLE_MESSAGE);
  }

  placeNotFound(externalId: string): NotFoundException {
    return new NotFoundException(`Place ${externalId} not found`);
  }
}
