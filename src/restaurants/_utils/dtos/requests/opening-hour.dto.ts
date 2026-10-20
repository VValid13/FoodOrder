import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Matches, Max, Min } from 'class-validator';
import { IsAfterProperty } from '../../../../_utils/decorators/is-after-property.decorator.js';
import {
  MAX_DAY_OF_WEEK,
  MIN_DAY_OF_WEEK,
  TIME_PATTERN,
} from '../../constants/restaurants.constants.js';

export class OpeningHourDto {
  @ApiProperty({
    example: 1,
    minimum: MIN_DAY_OF_WEEK,
    maximum: MAX_DAY_OF_WEEK,
    description: '0 = sunday, 6 = saturday',
  })
  @IsInt()
  @Min(MIN_DAY_OF_WEEK)
  @Max(MAX_DAY_OF_WEEK)
  day: number;

  @ApiProperty({ example: '11:30', pattern: TIME_PATTERN.source })
  @Matches(TIME_PATTERN, { message: 'open must use the HH:mm format' })
  open: string;

  @ApiProperty({ example: '14:30', pattern: TIME_PATTERN.source })
  @Matches(TIME_PATTERN, { message: 'close must use the HH:mm format' })
  @IsAfterProperty('open')
  close: string;
}
