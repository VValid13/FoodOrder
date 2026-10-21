import type { DayOfWeek } from '../constants/day-of-week.constants.js';
import type { Time } from './time.type.js';

export type OpeningDay = {
  day: DayOfWeek;
  open: Time;
  close: Time;
};
