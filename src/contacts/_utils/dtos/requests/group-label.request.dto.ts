import { Optional } from 'class-validator-extended';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';

export class GroupLabelRequestDto {
  @ApiProperty({ description: 'optional old label value', example: 'NewGroupName' })
  @Optional()
  oldLabel: string
  
  @ApiProperty({ description: 'new label value', example: 'NewGroupName' })
  @IsNotEmptyString()
  newLabel: string
}
