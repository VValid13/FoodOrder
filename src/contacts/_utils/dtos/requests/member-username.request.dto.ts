import { ApiProperty } from '@nestjs/swagger';

export class MemberUsernameRequestDto {
  @ApiProperty({
    description: 'the username of the user to invite in group',
    example: 'FriendUser',
  })
  username: string;
}
