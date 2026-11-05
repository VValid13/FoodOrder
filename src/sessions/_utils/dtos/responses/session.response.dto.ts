import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import type { PaymentMode, SessionStatus } from '../../../../database/database.types.js';
import { PAYMENT_MODES, SESSION_STATUSES } from '../../constants/sessions.constants.js';

export class SessionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  @ApiProperty({ format: 'uuid' })
  restaurantId: UUID;

  @ApiProperty({ example: 'Burgers du vendredi' })
  label: string;

  @ApiProperty({ enum: Object.values(SESSION_STATUSES), example: SESSION_STATUSES.DRAFT })
  status: SessionStatus;

  @ApiProperty()
  deadlineAt: Date;

  @ApiProperty()
  pickupAt: Date;

  @ApiProperty({ enum: Object.values(PAYMENT_MODES), example: PAYMENT_MODES.EACH_PAYS })
  paymentMode: PaymentMode;

  @ApiProperty({ type: String, nullable: true, example: 'Walid' })
  payerName: string | null;

  @ApiProperty({ example: 3 })
  fees: number;

  @ApiProperty({ example: 0 })
  discount: number;

  @ApiProperty()
  freeMode: boolean;

  @ApiProperty({ example: 'Kzh-FKI40WbU', description: 'Public part of the share link' })
  publicSlug: string;

  @ApiProperty({ description: 'The session is deleted after this date' })
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
