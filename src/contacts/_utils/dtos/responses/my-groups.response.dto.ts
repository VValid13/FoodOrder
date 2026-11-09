import { ApiProperty } from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { GroupResponseDto } from './group.response.dto.js';

export class MyGroupsResponseDto {
  @ApiProperty({type: [GroupResponseDto]})
  groups: GroupResponseDto[];
}
