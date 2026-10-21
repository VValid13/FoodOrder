export const TIME_FORMAT = 'HH:mm';
export const DATABASE_TIME_FORMAT = 'HH:mm:ss';
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const TIME_FORMAT_MESSAGE = '$property must use the HH:mm format';
export const END_OF_DAY = '23:59';

export const TIME_COMPARISONS = {
  AFTER: 'after',
  BEFORE: 'before',
} as const;

export type TimeComparison = (typeof TIME_COMPARISONS)[keyof typeof TIME_COMPARISONS];
