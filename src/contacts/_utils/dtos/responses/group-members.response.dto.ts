import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../../../users/_utils/dtos/responses/get-user.dto.js';
import { type UUID } from 'crypto';

export class GroupMembersResponseDto {
  
  @ApiProperty({type: String})
  groupId: UUID;

  @ApiProperty({type: [GetUserDto]})
  users: GetUserDto[];
}
