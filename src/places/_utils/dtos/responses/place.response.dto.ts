import { ApiProperty } from '@nestjs/swagger';
import { OpeningHourResponseDto } from '../../../../_utils/dtos/responses/opening-hour.response.dto.js';
import { EXTERNAL_ID_EXAMPLE } from '../../constants/places.constants.js';

export class PlaceResponseDto {
  @ApiProperty({ example: EXTERNAL_ID_EXAMPLE })
  externalId: string;

  @ApiProperty({ example: "McDonald's" })
  name: string;

  @ApiProperty({ type: String, nullable: true, example: 'Rue du Renard, Paris' })
  address: string | null;

  @ApiProperty({ type: String, nullable: true, example: '+33 1 40 27 04 21' })
  phone: string | null;

  @ApiProperty({ type: String, nullable: true, example: '48.8579329,2.351487' })
  coordinates: string | null;

  @ApiProperty({ type: String, nullable: true, example: 'burger' })
  cuisine: string | null;

  @ApiProperty({ type: [OpeningHourResponseDto] })
  openingHours: OpeningHourResponseDto[];

  @ApiProperty({ type: String, nullable: true, example: 'Mo-Su 09:00-01:00' })
  openingHoursText: string | null;
}
