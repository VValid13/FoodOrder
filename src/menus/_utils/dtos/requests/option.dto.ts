import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { UUID } from 'node:crypto';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../../../_utils/constants/amount.constants.js';
import { IsAmount } from '../../../../_utils/decorators/is-amount.decorator.js';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
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

  @ApiPropertyOptional({ example: 1.5, minimum: MIN_AMOUNT, maximum: MAX_AMOUNT, default: 0 })
  @Optional()
  @IsAmount()
  price?: number;
}
