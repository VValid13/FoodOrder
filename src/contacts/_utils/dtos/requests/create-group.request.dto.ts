import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';

export class CreateGroupRequestDto {
  @ApiProperty({ description: 'group name', example: 'NewGroupName' })
  @IsNotEmptyString()
  @MaxLength(12) //TODO MOVE TO CONSTANT
  label: string;
}
