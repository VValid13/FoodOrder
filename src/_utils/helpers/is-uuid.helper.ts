import { isUUID } from 'class-validator';
import type { UUID } from 'node:crypto';

export function isUuid(value: string): value is UUID {
  return isUUID(value);
}
