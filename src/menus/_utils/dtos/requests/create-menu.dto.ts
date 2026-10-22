import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { MENU_NAME_MAX_LENGTH } from '../../constants/menus.constants.js';

export class CreateMenuDto {
  @ApiProperty({ example: "McDonald's France", maxLength: MENU_NAME_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(MENU_NAME_MAX_LENGTH)
  name: string;
}
