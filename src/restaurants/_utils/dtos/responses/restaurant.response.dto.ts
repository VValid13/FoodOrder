import { ApiProperty } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { CoordinatesResponseDto } from '../../../../_utils/dtos/responses/coordinates.response.dto.js';
import { OpeningHourResponseDto } from '../../../../_utils/dtos/responses/opening-hour.response.dto.js';
import { RESTAURANT_DEFAULT_TIMEZONE } from '../../constants/restaurants.constants.js';
import { MenuSummaryResponseDto } from './menu-summary.response.dto.js';

export class RestaurantResponseDto {
  @ApiProperty({ format: 'uuid', example: '2a044937-1b6d-4674-ba96-1d029c9c1c26' })
  id: UUID;

  @ApiProperty({ example: 'Chez Mario' })
  name: string;

  @ApiProperty({ example: '12 rue des Archives, 75004 Paris' })
  address: string;

  @ApiProperty({ type: String, nullable: true, example: '+33 1 42 74 08 84' })
  phone: string | null;

  @ApiProperty({ type: CoordinatesResponseDto, nullable: true })
  coordinates: CoordinatesResponseDto | null;

  @ApiProperty({ example: RESTAURANT_DEFAULT_TIMEZONE })
  timezone: string;

  @ApiProperty({ type: String, nullable: true, example: 'node/599513428' })
  externalId: string | null;

  @ApiProperty({ type: MenuSummaryResponseDto, nullable: true })
  menu: MenuSummaryResponseDto | null;

  @ApiProperty({ type: [OpeningHourResponseDto] })
  openingHours: OpeningHourResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
