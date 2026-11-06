import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { IsUUID, MaxLength } from 'class-validator';
import { type UUID } from 'crypto';

export class RenameGroupRequestDto {
  @ApiProperty({ description: 'group id', example: '5f575f58-5ec9-4067-a360-9bdeaf2cde7a' })
  @IsUUID()
  groupId: UUID;

  @ApiProperty({ description: 'new label value', example: 'NewGroupName' })
  @IsNotEmptyString()
  @MaxLength(12) //TODO MOVE TO CONSTANT
  newLabel: string;
}
