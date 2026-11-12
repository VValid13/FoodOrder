import { ApiProperty } from '@nestjs/swagger';
import { INVITATIONS_SWAGGER } from '../../constants/invitations.constants.js';
import { InvitedParticipantResponseDto } from './invited-participant.response.dto.js';

export class InvitationsResponseDto {
  @ApiProperty({ type: [InvitedParticipantResponseDto] })
  participants: InvitedParticipantResponseDto[];

  @ApiProperty({ type: [String], example: ['Bob'], description: INVITATIONS_SWAGGER.SKIPPED_NAMES })
  skippedNames: string[];
}
