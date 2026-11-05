import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { UUID } from 'node:crypto';
import { MAX_PRICE, MIN_PRICE } from '../../../../_utils/constants/price.constants.js';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { IsPrice } from '../../../../_utils/decorators/is-price.decorator.js';
import { OPTION_LABEL_MAX_LENGTH } from '../../constants/menus.constants.js';

export class OptionDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'On update, keeps and edits this option' })
  @Optional()
  @IsUUID()
  id?: UUID;

  @ApiProperty({ example: 'Large', maxLength: OPTION_LABEL_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(OPTION_LABEL_MAX_LENGTH)
  label: string;

  @ApiPropertyOptional({ example: 1.5, minimum: MIN_PRICE, maximum: MAX_PRICE, default: 0 })
  @Optional()
  @IsPrice()
  price?: number;
}
