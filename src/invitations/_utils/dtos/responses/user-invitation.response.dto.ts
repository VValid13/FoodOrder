import { ApiProperty } from '@nestjs/swagger';
import { InvitationSessionResponseDto } from './invitation-session.response.dto.js';
import { ParticipantResponseDto } from './participant.response.dto.js';

export class UserInvitationResponseDto {
  @ApiProperty({ type: ParticipantResponseDto })
  participant: ParticipantResponseDto;

  @ApiProperty({ type: InvitationSessionResponseDto })
  session: InvitationSessionResponseDto;
}
