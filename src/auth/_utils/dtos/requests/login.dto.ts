import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import StrongPasswordDecorator from '../../../../_utils/decorators/strong-password.decorator.js';

export class LoginDto {
  @ApiProperty({ example: 'MyUsername' })
  @IsNotEmpty()
  username: string;

  @StrongPasswordDecorator()
  password: string;
}
