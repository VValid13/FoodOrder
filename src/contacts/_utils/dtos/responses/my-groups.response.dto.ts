import { ApiProperty } from '@nestjs/swagger';
import { GroupResponseDto } from './group.response.dto.js';

export class MyGroupsResponseDto {
  @ApiProperty({ type: [GroupResponseDto] })
  groups: GroupResponseDto[];
}
