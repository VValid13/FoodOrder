import { ApiProperty } from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { IsUUID } from 'class-validator';

export class MemberRequestDto {
  @ApiProperty({
    description: 'the id of the user to invite in group',
    example: 'FriendUser',
  })
  @IsUUID()
  id: UUID;
}
