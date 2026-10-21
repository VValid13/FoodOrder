import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import OpeningHours from 'opening_hours';
import { DAYS_OF_WEEK } from '../../../_utils/constants/day-of-week.constants.js';
import { END_OF_DAY } from '../../../_utils/constants/time.constants.js';
import { formatTime } from '../../../_utils/helpers/parse-time.helper.js';
import type { Coordinates } from '../../../_utils/types/coordinates.type.js';
import type { OpeningDay } from '../../../_utils/types/opening-day.type.js';
import {
  DAYS_PER_WEEK,
  OPENING_HOURS_COUNTRY_CODE,
  OPENING_HOURS_DEFAULT_COORDINATES,
  OPENING_HOURS_REFERENCE_WEEKS,
  OPENING_HOURS_VARIABLE_TIMES_PATTERN,
} from '../constants/places.constants.js';

@Injectable()
export class OpeningHoursMapper {
  toOpeningDays(value: string | undefined, coordinates: Coordinates | null): OpeningDay[] {
    if (!value || OPENING_HOURS_VARIABLE_TIMES_PATTERN.test(value)) {
      return [];
    }

    const openingHours = this.parse(value, coordinates ?? OPENING_HOURS_DEFAULT_COORDINATES);
    if (!openingHours) {
      return [];
    }

    const weeks = OPENING_HOURS_REFERENCE_WEEKS.map((weekStart) =>
      this.toWeeklySlots(openingHours, dayjs(weekStart)),
    );
    const isSameEveryWeek = weeks.every(
      (week) => JSON.stringify(week) === JSON.stringify(weeks[0]),
    );
    return isSameEveryWeek ? (weeks[0] ?? []) : [];
  }

  private parse(value: string, { latitude, longitude }: Coordinates): OpeningHours | null {
    try {
      return new OpeningHours(value, {
        lat: latitude,
        lon: longitude,
        address: { country_code: OPENING_HOURS_COUNTRY_CODE, state: '' },
      });
    } catch {
      return null;
    }
  }

  private toWeeklySlots(openingHours: OpeningHours, weekStart: Dayjs): OpeningDay[] {
    const weekEnd = weekStart.add(DAYS_PER_WEEK, 'day');
    return openingHours
      .getOpenIntervals(weekStart.toDate(), weekEnd.toDate())
      .flatMap(([from, to]) => this.splitByDay(dayjs(from), dayjs(to)))
      .sort(
        (first, second) =>
          DAYS_OF_WEEK.indexOf(first.day) - DAYS_OF_WEEK.indexOf(second.day) ||
          first.open.localeCompare(second.open),
      );
  }

  private splitByDay(from: Dayjs, to: Dayjs): OpeningDay[] {
    const slots: OpeningDay[] = [];
    let start = from;
    while (start.isBefore(to)) {
      const nextMidnight = start.startOf('day').add(1, 'day');
      const end = to.isBefore(nextMidnight) ? to : nextMidnight;
      const open = formatTime(start);
      const close = end.isSame(nextMidnight) ? END_OF_DAY : formatTime(end);
      if (open < close) {
        slots.push({ day: DAYS_OF_WEEK[start.day()], open, close });
      }
      start = end;
    }
    return slots;
  }
}
