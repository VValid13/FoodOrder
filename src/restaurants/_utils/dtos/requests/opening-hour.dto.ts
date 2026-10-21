import { ApiProperty } from '@nestjs/swagger';
import { IsIn, Matches } from 'class-validator';
import {
  DAY_OF_WEEK_MESSAGE,
  DAYS_OF_WEEK,
} from '../../../../_utils/constants/day-of-week.constants.js';
import type { DayOfWeek } from '../../../../_utils/constants/day-of-week.constants.js';
import {
  TIME_COMPARISONS,
  TIME_FORMAT_MESSAGE,
  TIME_PATTERN,
} from '../../../../_utils/constants/time.constants.js';
import { IsAfterOrBefore } from '../../../../_utils/validators/is-after-or-before.validator.js';

export class OpeningHourDto {
  @ApiProperty({ enum: DAYS_OF_WEEK, example: 'monday' })
  @IsIn(DAYS_OF_WEEK, { message: DAY_OF_WEEK_MESSAGE })
  day: DayOfWeek;

  @ApiProperty({ example: '11:30', pattern: TIME_PATTERN.source })
  @Matches(TIME_PATTERN, { message: TIME_FORMAT_MESSAGE })
  open: string;

  @ApiProperty({ example: '14:30', pattern: TIME_PATTERN.source })
  @Matches(TIME_PATTERN, { message: TIME_FORMAT_MESSAGE })
  @IsAfterOrBefore('open', TIME_COMPARISONS.AFTER)
  close: string;
}
