import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsTimeZone,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Optional } from 'class-validator-extended';
import type { UUID } from 'node:crypto';
import { IsNotEmptyString } from '../../../../_utils/decorators/is-not-empty-string.decorator.js';
import {
  RESTAURANT_ADDRESS_MAX_LENGTH,
  RESTAURANT_DEFAULT_TIMEZONE,
  RESTAURANT_MAX_OPENING_HOURS,
  RESTAURANT_NAME_MAX_LENGTH,
  RESTAURANT_PHONE_MAX_LENGTH,
} from '../../constants/restaurants.constants.js';
import { CoordinatesDto } from './coordinates.dto.js';
import { OpeningHourDto } from './opening-hour.dto.js';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Chez Mario', maxLength: RESTAURANT_NAME_MAX_LENGTH })
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_NAME_MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: '12 rue des Archives, 75004 Paris',
    maxLength: RESTAURANT_ADDRESS_MAX_LENGTH,
  })
  @IsNotEmptyString()
  @MaxLength(RESTAURANT_ADDRESS_MAX_LENGTH)
  address: string;

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

  @ApiPropertyOptional({ type: CoordinatesDto, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto | null;

  @ApiPropertyOptional({
    example: RESTAURANT_DEFAULT_TIMEZONE,
    default: RESTAURANT_DEFAULT_TIMEZONE,
  })
  @Optional()
  @IsTimeZone()
  timezone?: string;

  @ApiPropertyOptional({ type: String, format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  menuId?: UUID | null;

  @ApiPropertyOptional({ type: [OpeningHourDto], maxItems: RESTAURANT_MAX_OPENING_HOURS })
  @Optional()
  @IsArray()
  @ArrayMaxSize(RESTAURANT_MAX_OPENING_HOURS)
  @ValidateNested({ each: true })
  @Type(() => OpeningHourDto)
  openingHours?: OpeningHourDto[];
}
