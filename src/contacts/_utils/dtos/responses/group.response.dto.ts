import { ApiProperty } from "@nestjs/swagger";
import { type UUID } from "crypto";

export class GroupResponseDto {
  @ApiProperty()
  groupId: UUID;
  
  @ApiProperty()
  groupLabel: string;
}