import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';

export class MemberUsernameRequestDto {
  @ApiProperty({
    description: 'the username of the user to invite in group',
    example: 'FriendUser',
  })
  @IsNotEmptyString()
  username: string;
}
