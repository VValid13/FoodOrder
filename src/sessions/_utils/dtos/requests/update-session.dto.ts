import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto.js';

export class UpdateSessionDto extends PartialType(
  OmitType(CreateSessionDto, ['restaurantId'] as const),
  { skipNullProperties: false },
) {}
