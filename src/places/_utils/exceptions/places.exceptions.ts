import { BadGatewayException, Injectable } from '@nestjs/common';

export const PLACES_UNAVAILABLE_MESSAGE = 'Places provider is unavailable, try again later';

@Injectable()
export class PlacesExceptions {
  readonly unavailable = new BadGatewayException(PLACES_UNAVAILABLE_MESSAGE);
}
