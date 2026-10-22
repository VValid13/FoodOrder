import { ApiProperty } from '@nestjs/swagger';

export class CoordinatesResponseDto {
  @ApiProperty({ example: 48.8566 })
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  longitude: number;
}
