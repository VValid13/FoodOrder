import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsTimeZone,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import type { UUID } from 'node:crypto';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import { IsOptionalNotNull } from '../../../../_utils/decorators/is-optional-not-null.decorator.js';
import {
  COORDINATES_EXAMPLE,
  COORDINATES_PATTERN,
  RESTAURANT_ADDRESS_MAX_LENGTH,
  RESTAURANT_DEFAULT_TIMEZONE,
  RESTAURANT_MAX_OPENING_HOURS,
  RESTAURANT_NAME_MAX_LENGTH,
  RESTAURANT_PHONE_MAX_LENGTH,
} from '../../constants/restaurants.constants.js';
import { OpeningHourDto } from './opening-hour.dto.js';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({ example: 'Chez Mario', maxLength: RESTAURANT_NAME_MAX_LENGTH })
  @IsOptionalNotNull()
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_NAME_MAX_LENGTH)
  name?: string;

  @ApiPropertyOptional({
    example: '12 rue des Archives, 75004 Paris',
    maxLength: RESTAURANT_ADDRESS_MAX_LENGTH,
  })
  @IsOptionalNotNull()
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_ADDRESS_MAX_LENGTH)
  address?: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: '+33 1 42 74 08 84',
    maxLength: RESTAURANT_PHONE_MAX_LENGTH,
  })
  @IsOptional()
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_PHONE_MAX_LENGTH)
  phone?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: COORDINATES_EXAMPLE })
  @IsOptional()
  @Matches(COORDINATES_PATTERN, { message: 'coordinates must use the lat,lon format' })
  coordinates?: string | null;

  @ApiPropertyOptional({ example: RESTAURANT_DEFAULT_TIMEZONE })
  @IsOptionalNotNull()
  @IsTimeZone()
  timezone?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  menuId?: UUID | null;

  @ApiPropertyOptional({
    type: [OpeningHourDto],
    maxItems: RESTAURANT_MAX_OPENING_HOURS,
    description: 'Replaces every opening hour of the restaurant',
  })
  @IsOptionalNotNull()
  @IsArray()
  @ArrayMaxSize(RESTAURANT_MAX_OPENING_HOURS)
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  openingHours?: OpeningHourDto[];
}
