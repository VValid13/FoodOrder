import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import {
  EXTERNAL_ID_EXAMPLE,
  EXTERNAL_ID_PATTERN,
} from '../../../../places/_utils/constants/places.constants.js';

export class ImportRestaurantDto {
  @ApiProperty({ example: EXTERNAL_ID_EXAMPLE, pattern: EXTERNAL_ID_PATTERN.source })
  @Matches(EXTERNAL_ID_PATTERN, { message: 'externalId must look like node/123' })
  externalId: string;
}
