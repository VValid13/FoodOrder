import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  DISH_CATEGORY_MAX_LENGTH,
  DISH_LABEL_MAX_LENGTH,
  MAX_OPTION_GROUPS_PER_DISH,
  MAX_PRICE,
  MIN_POSITION,
  MIN_PRICE,
  PRICE_DECIMAL_PLACES,
  PRICE_FORMAT_MESSAGE,
} from '../../constants/menus.constants.js';
import { OptionGroupDto } from './option-group.dto.js';

export class CreateDishDto {
  @ApiProperty({ example: 'Big Mac', maxLength: DISH_LABEL_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(DISH_LABEL_MAX_LENGTH)
  label: string;

  @ApiProperty({ example: 'Burgers', maxLength: DISH_CATEGORY_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(DISH_CATEGORY_MAX_LENGTH)
  category: string;

  @ApiProperty({ example: 8.3, minimum: MIN_PRICE, maximum: MAX_PRICE })
  @IsNumber({ maxDecimalPlaces: PRICE_DECIMAL_PLACES }, { message: PRICE_FORMAT_MESSAGE })
  @Min(MIN_PRICE)
  @Max(MAX_PRICE)
  price: number;

  @ApiPropertyOptional({ example: true, default: true })
  @Optional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ example: 0, minimum: MIN_POSITION, default: MIN_POSITION })
  @Optional()
  @IsInt()
  @Min(MIN_POSITION)
  position?: number;

  @ApiPropertyOptional({
    type: [OptionGroupDto],
    maxItems: MAX_OPTION_GROUPS_PER_DISH,
    description: 'On update, replaces every option group of the dish',
  })
  @Optional()
  @IsArray()
  @ArrayMaxSize(MAX_OPTION_GROUPS_PER_DISH)
  @ValidateNested({ each: true })
  @Type(() => OptionGroupDto)
  optionGroups?: OptionGroupDto[];
}
