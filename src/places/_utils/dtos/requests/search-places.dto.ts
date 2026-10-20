import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  PLACES_MAX_RADIUS_METERS,
  PLACES_MIN_RADIUS_METERS,
  PLACES_NAME_MAX_LENGTH,
  PLACES_NAME_PATTERN,
} from '../../constants/places.constants.js';

export class SearchPlacesDto {
  @ApiProperty({ example: 48.8566 })
  @Type(() => Number)
  @IsLatitude()
  lat: number;

  @ApiProperty({ example: 2.3522 })
  @Type(() => Number)
  @IsLongitude()
  lon: number;

  @ApiProperty({
    example: 500,
    minimum: PLACES_MIN_RADIUS_METERS,
    maximum: PLACES_MAX_RADIUS_METERS,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PLACES_MIN_RADIUS_METERS)
  @Max(PLACES_MAX_RADIUS_METERS)
  radius: number;

  @ApiPropertyOptional({ example: 'mcdonald', maxLength: PLACES_NAME_MAX_LENGTH })
  @IsOptional()
  @IsNotEmptyString()
  @MaxLength(PLACES_NAME_MAX_LENGTH)
  @Matches(PLACES_NAME_PATTERN, { message: 'name contains forbidden characters' })
  name?: string;
}
