import { ApiProperty } from '@nestjs/swagger';

export class OpeningHourResponseDto {
  @ApiProperty({ example: 1, description: '0 = sunday, 6 = saturday' })
  day: number;

  @ApiProperty({ example: '11:30' })
  open: string;

  @ApiProperty({ example: '14:30' })
  close: string;
}
