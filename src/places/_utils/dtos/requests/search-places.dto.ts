import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, Matches, MaxLength, ValidateIf } from 'class-validator';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  PLACES_NAME_FORMAT_MESSAGE,
  PLACES_NAME_MAX_LENGTH,
  PLACES_NAME_PATTERN,
} from '../../constants/places.constants.js';

const hasCoordinates = (dto: SearchPlacesDto): boolean =>
  dto.lat !== undefined || dto.lon !== undefined;

export class SearchPlacesDto {
  @ApiProperty({ example: 'mcdonald', maxLength: PLACES_NAME_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(PLACES_NAME_MAX_LENGTH)
  @Matches(PLACES_NAME_PATTERN, { message: PLACES_NAME_FORMAT_MESSAGE })
  name: string;

  @ApiPropertyOptional({ example: 48.8566, description: 'Required with lon' })
  @ValidateIf(hasCoordinates)
  @Type(() => Number)
  @IsLatitude()
  lat?: number;

  @ApiPropertyOptional({ example: 2.3522, description: 'Required with lat' })
  @ValidateIf(hasCoordinates)
  @Type(() => Number)
  @IsLongitude()
  lon?: number;
}
