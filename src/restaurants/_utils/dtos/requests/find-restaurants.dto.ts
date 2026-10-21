import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, Matches, MaxLength, ValidateIf } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  RESTAURANT_SEARCH_NAME_MAX_LENGTH,
  RESTAURANT_SEARCH_NAME_MESSAGE,
  RESTAURANT_SEARCH_NAME_PATTERN,
} from '../../constants/restaurants.constants.js';

const hasCoordinates = (dto: FindRestaurantsDto): boolean =>
  dto.lat !== undefined || dto.lon !== undefined;

export class FindRestaurantsDto {
  @ApiPropertyOptional({ example: 'mcdonald', maxLength: RESTAURANT_SEARCH_NAME_MAX_LENGTH })
  @Optional()
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_SEARCH_NAME_MAX_LENGTH)
  @Matches(RESTAURANT_SEARCH_NAME_PATTERN, { message: RESTAURANT_SEARCH_NAME_MESSAGE })
  name?: string;

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
