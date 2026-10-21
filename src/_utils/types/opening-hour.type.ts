import type { DayOfWeek } from '../constants/day-of-week.constants.js';

export type OpeningHour = {
  day: DayOfWeek;
  open: string;
  close: string;
};
