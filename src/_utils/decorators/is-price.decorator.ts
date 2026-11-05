import { applyDecorators } from '@nestjs/common';
import { IsNumber, Max, Min } from 'class-validator';
import {
  MAX_PRICE,
  MIN_PRICE,
  PRICE_DECIMAL_PLACES,
  PRICE_FORMAT_MESSAGE,
} from '../constants/price.constants.js';

export function IsPrice(): PropertyDecorator {
  return applyDecorators(
    IsNumber({ maxDecimalPlaces: PRICE_DECIMAL_PLACES }, { message: PRICE_FORMAT_MESSAGE }),
    Min(MIN_PRICE),
    Max(MAX_PRICE),
  );
}
