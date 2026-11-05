import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { UUID } from 'node:crypto';
import { MAX_AMOUNT, MIN_AMOUNT } from '../../../../_utils/constants/amount.constants.js';
import { IsAmount } from '../../../../_utils/decorators/is-amount.decorator.js';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { ToBoolean } from '../../../../_utils/decorators/to-boolean.decorator.js';
import type { PaymentMode } from '../../../../database/database.types.js';
import {
  PAYMENT_MODE_MESSAGE,
  PAYMENT_MODES,
  SESSION_LABEL_MAX_LENGTH,
  SESSION_PAYER_NAME_MAX_LENGTH,
} from '../../constants/sessions.constants.js';

export class CreateSessionDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  restaurantId: UUID;

  @ApiProperty({ example: 'Burgers du vendredi', maxLength: SESSION_LABEL_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(SESSION_LABEL_MAX_LENGTH)
  label: string;

  @ApiProperty({ example: '2026-11-06T11:45:00+01:00', description: 'Must be in the future' })
  @Type(() => Date)
  @IsDate()
  deadlineAt: Date;

  @ApiProperty({
    example: '2026-11-06T12:30:00+01:00',
    description: 'After deadlineAt and during the restaurant opening hours',
  })
  @Type(() => Date)
  @IsDate()
  pickupAt: Date;

  @ApiPropertyOptional({ enum: Object.values(PAYMENT_MODES), default: PAYMENT_MODES.EACH_PAYS })
  @Optional()
  @IsIn(Object.values(PAYMENT_MODES), { message: PAYMENT_MODE_MESSAGE })
  paymentMode?: PaymentMode;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: 'Walid',
    maxLength: SESSION_PAYER_NAME_MAX_LENGTH,
  })
  @IsOptional()
  @IsNotEmptyString()
  @MaxLength(SESSION_PAYER_NAME_MAX_LENGTH)
  payerName?: string | null;

  @ApiPropertyOptional({ example: 3, minimum: MIN_AMOUNT, maximum: MAX_AMOUNT, default: 0 })
  @Optional()
  @IsAmount()
  fees?: number;

  @ApiPropertyOptional({ example: 0, minimum: MIN_AMOUNT, maximum: MAX_AMOUNT, default: 0 })
  @Optional()
  @IsAmount()
  discount?: number;

  @ApiPropertyOptional({
    default: false,
    description: 'Participants write free text instead of picking dishes',
  })
  @Optional()
  @ToBoolean()
  freeMode?: boolean;
}
