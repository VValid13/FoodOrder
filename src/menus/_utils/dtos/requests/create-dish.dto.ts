import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, MaxLength, ValidateNested } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../../../_utils/constants/amount.constants.js';
import { IsAmount } from '../../../../_utils/decorators/is-amount.decorator.js';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  DISH_CATEGORY_MAX_LENGTH,
  DISH_LABEL_MAX_LENGTH,
  MAX_OPTION_GROUPS_PER_DISH,
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

  @ApiProperty({ example: 8.3, minimum: MIN_AMOUNT, maximum: MAX_AMOUNT })
  @IsAmount()
  price: number;

  @ApiPropertyOptional({
    type: [OptionGroupDto],
    maxItems: MAX_OPTION_GROUPS_PER_DISH,
    description:
      'On update: groups and options with an id are edited, without an id they are created, missing ones are removed',
  })
  @Optional()
  @IsArray()
  @ArrayMaxSize(MAX_OPTION_GROUPS_PER_DISH)
  @ValidateNested({ each: true })
  @Type(() => OptionGroupDto)
  optionGroups?: OptionGroupDto[];
}
