import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { TIME_FORMAT } from '../constants/time.constants.js';

dayjs.extend(customParseFormat);

export function parseTime(value: string, format: string = TIME_FORMAT): Dayjs | null {
  const time = dayjs(value, format, true);
  return time.isValid() ? time : null;
}
