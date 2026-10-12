import {ValueOf} from "./env.constants.js";

export const ErrorCode = {
  DATABASE_UNAVAILABLE : '08006'
} as const satisfies Record<string, string>;
export type ErrorCode = ValueOf<typeof ErrorCode>

