import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  MAX_PARTICIPANTS_PER_SESSION,
  PARTICIPANT_NAME_MAX_LENGTH,
} from '../../constants/invitations.constants.js';

export class CreateInvitationsDto {
  @ApiProperty({
    type: [String],
    example: ['Alice', 'Bob'],
    minItems: 1,
    maxItems: MAX_PARTICIPANTS_PER_SESSION,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_PARTICIPANTS_PER_SESSION)
  @IsNotEmptyString({ each: true })
  @MaxLength(PARTICIPANT_NAME_MAX_LENGTH, { each: true })
  names: string[];
}
