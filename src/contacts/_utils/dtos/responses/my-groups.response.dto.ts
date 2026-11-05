import { ApiProperty } from "@nestjs/swagger";
import { type UUID } from "crypto";


export class MyGroupsResponseDto {
  @ApiProperty()
  groups: {groupId: UUID, groupLabel: string}[];
}
