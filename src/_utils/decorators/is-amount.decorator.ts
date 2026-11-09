import { applyDecorators } from '@nestjs/common';
import { IsNumber, Max, Min } from 'class-validator';
import {
  AMOUNT_DECIMAL_PLACES,
  AMOUNT_FORMAT_MESSAGE,
  MAX_AMOUNT,
  MIN_AMOUNT,
} from '../constants/amount.constants.js';

export function IsAmount(): PropertyDecorator {
  return applyDecorators(
    IsNumber({ maxDecimalPlaces: AMOUNT_DECIMAL_PLACES }, { message: AMOUNT_FORMAT_MESSAGE }),
    Min(MIN_AMOUNT),
    Max(MAX_AMOUNT),
  );
}
