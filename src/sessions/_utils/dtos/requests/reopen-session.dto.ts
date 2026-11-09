import { PartialType, PickType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto.js';

export class ReopenSessionDto extends PartialType(
  PickType(CreateSessionDto, ['deadlineAt', 'pickupAt'] as const),
  { skipNullProperties: false },
) {}
