import { PickType } from '@nestjs/swagger';
import { SessionResponseDto } from '../../../../sessions/_utils/dtos/responses/session.response.dto.js';

export class InvitationSessionResponseDto extends PickType(SessionResponseDto, [
  'id',
  'label',
  'status',
  'deadlineAt',
  'pickupAt',
  'paymentMode',
  'payerName',
  'fees',
  'discount',
  'freeMode',
] as const) {}
