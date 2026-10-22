import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export class CoordinatesDto {
  @ApiProperty({ example: 48.8566 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsLongitude()
  longitude: number;
}
