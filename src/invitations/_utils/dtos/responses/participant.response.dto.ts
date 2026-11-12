import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import type { ParticipantStatus } from '../../../../database/database.types.js';
import { PARTICIPANT_STATUSES } from '../../constants/invitations.constants.js';

export class ParticipantResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  @ApiProperty({ example: 'Alice' })
  name: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  userId: UUID | null;

  @ApiProperty({ enum: Object.values(PARTICIPANT_STATUSES), example: PARTICIPANT_STATUSES.INVITED })
  status: ParticipantStatus;
}
