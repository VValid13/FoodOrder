import { ValueOf } from '../utils.types.js';

export const ERROR_KEYS = {
  DATABASE_UNAVAILABLE: '08006',
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  UUID_FORMAT_VIOLATION: '22P02',
  NO_RESULT_ERROR: '02000'

} as const satisfies Record<string, string>;
export type ErrorCodeType = ValueOf<typeof ERROR_KEYS>;
