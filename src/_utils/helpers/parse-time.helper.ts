import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { END_OF_DAY, TIME_FORMAT, TIME_PATTERN } from '../constants/time.constants.js';
import type { Time } from '../types/time.type.js';

export function parseTime(value: string, format: string = TIME_FORMAT): Dayjs | null {
  const time = dayjs(value, format, true);
  return time.isValid() ? time : null;
}

export function isTime(value: string): value is Time {
  return TIME_PATTERN.test(value);
}

export function formatTime(time: Dayjs): Time {
  const formatted = time.format(TIME_FORMAT);
  return isTime(formatted) ? formatted : END_OF_DAY;
}
