import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { UUID } from 'node:crypto';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { ToBoolean } from '../../../../_utils/decorators/to-boolean.decorator.js';
import { IsAtMostLengthOf } from '../../../../_utils/validators/is-at-most-length-of.validator.js';
import {
  MAX_OPTIONS_PER_GROUP,
  MIN_CHOICES,
  OPTION_GROUP_LABEL_MAX_LENGTH,
} from '../../constants/menus.constants.js';
import { OptionDto } from './option.dto.js';

export class OptionGroupDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'On update, keeps and edits this group' })
  @Optional()
  @IsUUID()
  id?: UUID;

  @ApiProperty({ example: 'Size', maxLength: OPTION_GROUP_LABEL_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(OPTION_GROUP_LABEL_MAX_LENGTH)
  label: string;

  @ApiPropertyOptional({ example: true, default: false })
  @Optional()
  @ToBoolean()
  required?: boolean;

  @ApiPropertyOptional({ example: 1, minimum: MIN_CHOICES, default: MIN_CHOICES })
  @Optional()
  @IsInt()
  @Min(MIN_CHOICES)
  @IsAtMostLengthOf('options')
  maxChoices?: number;

  @ApiProperty({ type: [OptionDto], minItems: 1, maxItems: MAX_OPTIONS_PER_GROUP })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_OPTIONS_PER_GROUP)
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}
