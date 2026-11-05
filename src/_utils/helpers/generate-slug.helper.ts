import { randomBytes } from 'node:crypto';

export function generateSlug(length: number): string {
  return randomBytes(length).toString('base64url').slice(0, length);
}
