import { ApiProperty } from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { IsUUID } from 'class-validator';

export class MemberRequestDto {
  @ApiProperty({
    description: 'the id of the user to invite in group',
    example: 'f8c93d14-7b9b-465c-8574-6496f41ff052',
  })
  @IsUUID()
  id: UUID;
}
