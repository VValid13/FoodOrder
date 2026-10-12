import {ValueOf} from "./env.constants.js";

export const ERROR_KEYS = {
  DATABASE_UNAVAILABLE : '08006',
} as const satisfies Record<string, string>;
export type ErrorCodeType = ValueOf<typeof ERROR_KEYS>;

