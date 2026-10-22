import type { ValueOf } from '../utils.types.js';

export const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type DayOfWeek = ValueOf<typeof DAYS_OF_WEEK>;

export const DAY_OF_WEEK_MESSAGE = `$property must be one of ${DAYS_OF_WEEK.join(', ')}`;
