import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, Max, MaxLength, Min } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  MAX_PRICE,
  MIN_PRICE,
  OPTION_LABEL_MAX_LENGTH,
  PRICE_DECIMAL_PLACES,
  PRICE_FORMAT_MESSAGE,
} from '../../constants/menus.constants.js';

export class OptionDto {
  @ApiProperty({ example: 'Large', maxLength: OPTION_LABEL_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(OPTION_LABEL_MAX_LENGTH)
  label: string;

  @ApiPropertyOptional({ example: 1.5, minimum: MIN_PRICE, maximum: MAX_PRICE, default: 0 })
  @Optional()
  @IsNumber({ maxDecimalPlaces: PRICE_DECIMAL_PLACES }, { message: PRICE_FORMAT_MESSAGE })
  @Min(MIN_PRICE)
  @Max(MAX_PRICE)
  price?: number;
}
