import { ApiProperty } from '@nestjs/swagger';
import { RestaurantWithMenuResponseDto } from '../../../../restaurants/_utils/dtos/responses/restaurant-with-menu.response.dto.js';
import { InvitationSessionResponseDto } from './invitation-session.response.dto.js';
import { ParticipantResponseDto } from './participant.response.dto.js';

export class MyInvitationResponseDto {
  @ApiProperty({ type: ParticipantResponseDto })
  participant: ParticipantResponseDto;

  @ApiProperty({ type: InvitationSessionResponseDto })
  session: InvitationSessionResponseDto;

  @ApiProperty({ type: RestaurantWithMenuResponseDto })
  restaurant: RestaurantWithMenuResponseDto;
}
