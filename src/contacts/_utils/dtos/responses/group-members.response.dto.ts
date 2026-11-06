import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from '../../../../users/_utils/dtos/responses/get-user.dto.js';

export class GroupMembersResponseDto {
  @ApiProperty()
  users: GetUserDto[];
}
