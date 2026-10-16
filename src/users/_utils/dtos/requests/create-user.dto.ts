import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import StrongPasswordDecorator from '../../../../_utils/decorators/strong-password.decorator.js';

export class CreateUserDto {
  @ApiProperty({ example: 'UserName' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Str0ng$P4ssword' })
  @StrongPasswordDecorator()
  password: string;
}
