import { ApiProperty } from '@nestjs/swagger';

export class GroupLabelRequestDto {
  @ApiProperty({ description: 'label value', example: 'NewGroupName' })
  label: string;
}
