import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import * as crypto from 'crypto';

export class GetUserDto {
  @ApiProperty({ example: '2a044937-1b6d-4674-ba96-1d029c9c1c26' })
  @IsNotEmpty()
  @IsUUID()
  id: crypto.UUID;

  @ApiProperty({ example: 'Username' })
  @IsNotEmpty()
  //@IsUnique(User, { excludeDeleted: false }) // need isUnique utls
  username: string;
}
