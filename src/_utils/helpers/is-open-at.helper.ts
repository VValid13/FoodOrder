import dayjs from 'dayjs';
import { DAYS_OF_WEEK } from '../constants/day-of-week.constants.js';
import { TIME_FORMAT } from '../constants/time.constants.js';
import type { OpeningDay } from '../types/opening-day.type.js';

export function isOpenAt(openingHours: OpeningDay[], timezone: string, date: Date): boolean {
  const localDate = dayjs(date).tz(timezone);
  const day = DAYS_OF_WEEK[localDate.day()];
  const time = localDate.format(TIME_FORMAT);

  return openingHours.some(
    (openingDay) => openingDay.day === day && openingDay.open <= time && time < openingDay.close,
  );
}
