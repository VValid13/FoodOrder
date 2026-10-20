import type { OpeningHour } from '../../../_utils/types/opening-hour.type.js';
import {
  END_OF_DAY,
  OPENING_HOURS_ALL_WEEK,
  OPENING_HOURS_CLOSE_PATTERN,
  OPENING_HOURS_CLOSED_VALUES,
  OPENING_HOURS_END_OF_DAY,
  OPENING_HOURS_OPEN_PATTERN,
  OPENING_HOURS_PUBLIC_HOLIDAY_PREFIX,
  OPENING_HOURS_RULE_PATTERN,
  OPENING_HOURS_TIME_RANGE_PATTERN,
  OSM_DAY_TO_DAY_OF_WEEK,
  OSM_DAYS,
  START_OF_DAY,
} from '../constants/places.constants.js';

type TimeRange = { open: string; close: string };

const ALL_DAYS = OSM_DAYS.map((_, index) => index);

function parseDays(value: string | undefined): number[] | null {
  if (!value) {
    return ALL_DAYS;
  }

  const days: number[] = [];
  for (const part of value.replace(/\s/g, '').split(',')) {
    const [start, end] = part.split('-').map((day) => OSM_DAYS.indexOf(day as never));
    if (start === undefined || start < 0 || (end !== undefined && end < 0)) {
      return null;
    }
    const last = end ?? start;
    for (let index = start; ; index = (index + 1) % OSM_DAYS.length) {
      days.push(index);
      if (index === last) {
        break;
      }
    }
  }
  return days;
}

function parseTimes(value: string): TimeRange[] | null {
  if (OPENING_HOURS_CLOSED_VALUES.includes(value)) {
    return [];
  }

  const ranges: TimeRange[] = [];
  for (const part of value.split(',')) {
    const groups = OPENING_HOURS_TIME_RANGE_PATTERN.exec(part.trim())?.groups;
    if (
      !groups?.open ||
      !groups.close ||
      !OPENING_HOURS_OPEN_PATTERN.test(groups.open) ||
      !OPENING_HOURS_CLOSE_PATTERN.test(groups.close)
    ) {
      return null;
    }
    ranges.push({ open: groups.open, close: groups.close });
  }
  return ranges;
}

function toOpeningHours(osmDay: number, { open, close }: TimeRange): OpeningHour[] {
  const day = OSM_DAY_TO_DAY_OF_WEEK[osmDay] as number;
  const nextDay = OSM_DAY_TO_DAY_OF_WEEK[(osmDay + 1) % OSM_DAYS.length] as number;

  if (close === OPENING_HOURS_END_OF_DAY || close === open || close === START_OF_DAY) {
    return [{ day, open, close: END_OF_DAY }];
  }
  if (close > open) {
    return [{ day, open, close }];
  }
  return [
    { day, open, close: END_OF_DAY },
    { day: nextDay, open: START_OF_DAY, close },
  ];
}

export function parseOpeningHours(value: string | undefined): OpeningHour[] | null {
  if (!value) {
    return null;
  }

  const rangesByDay = new Map<number, TimeRange[]>();

  for (const rule of value.split(';').map((part) => part.trim())) {
    if (!rule || rule.startsWith(OPENING_HOURS_PUBLIC_HOLIDAY_PREFIX)) {
      continue;
    }
    if (rule === OPENING_HOURS_ALL_WEEK) {
      ALL_DAYS.forEach((day) => rangesByDay.set(day, [{ open: START_OF_DAY, close: END_OF_DAY }]));
      continue;
    }

    const groups = OPENING_HOURS_RULE_PATTERN.exec(rule)?.groups;
    const days = parseDays(groups?.days);
    const ranges = groups?.times ? parseTimes(groups.times.trim()) : null;
    if (!days || !ranges) {
      return null;
    }
    days.forEach((day) => rangesByDay.set(day, ranges));
  }

  return [...rangesByDay.entries()]
    .flatMap(([osmDay, ranges]) => ranges.flatMap((range) => toOpeningHours(osmDay, range)))
    .sort((first, second) => first.day - second.day || first.open.localeCompare(second.open));
}
