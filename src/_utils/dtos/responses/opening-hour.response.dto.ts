import { ApiProperty } from '@nestjs/swagger';
import { DAYS_OF_WEEK } from '../../constants/day-of-week.constants.js';
import type { DayOfWeek } from '../../constants/day-of-week.constants.js';
import { TIME_PATTERN } from '../../constants/time.constants.js';

export class OpeningHourResponseDto {
  @ApiProperty({ enum: DAYS_OF_WEEK, example: 'monday' })
  day: DayOfWeek;

  @ApiProperty({ example: '11:30', pattern: TIME_PATTERN.source })
  open: string;

  @ApiProperty({ example: '14:30', pattern: TIME_PATTERN.source })
  close: string;
}
