import { ApiProperty } from '@nestjs/swagger';
import { INVITATIONS_SWAGGER } from '../../constants/invitations.constants.js';
import { ParticipantResponseDto } from './participant.response.dto.js';

export class InvitedParticipantResponseDto extends ParticipantResponseDto {
  @ApiProperty({ description: INVITATIONS_SWAGGER.TOKEN })
  token: string;
}
