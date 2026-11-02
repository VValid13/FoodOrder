import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeUsernameDto {
  @ApiProperty({ example: 'newUsername' })
  @IsNotEmpty()
  username: string;
}
