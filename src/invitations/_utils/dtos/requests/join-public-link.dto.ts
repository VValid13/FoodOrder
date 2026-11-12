import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { PARTICIPANT_NAME_MAX_LENGTH } from '../../constants/invitations.constants.js';

export class JoinPublicLinkDto {
  @ApiProperty({ example: 'Alice', maxLength: PARTICIPANT_NAME_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(PARTICIPANT_NAME_MAX_LENGTH)
  name: string;
}
