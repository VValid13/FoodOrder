import { ApiProperty } from '@nestjs/swagger';
import { DAYS_OF_WEEK } from '../../constants/day-of-week.constants.js';
import type { DayOfWeek } from '../../constants/day-of-week.constants.js';
import { TIME_PATTERN } from '../../constants/time.constants.js';
import type { Time } from '../../types/time.type.js';

export class OpeningDayResponseDto {
  @ApiProperty({ enum: DAYS_OF_WEEK, example: 'monday' })
  day: DayOfWeek;

  @ApiProperty({ type: String, example: '11:30', pattern: TIME_PATTERN.source })
  open: Time;

  @ApiProperty({ type: String, example: '14:30', pattern: TIME_PATTERN.source })
  close: Time;
}
