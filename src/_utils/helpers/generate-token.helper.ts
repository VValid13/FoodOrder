import { randomBytes } from 'node:crypto';

export function generateToken(length: number): string {
  return randomBytes(length).toString('base64url').slice(0, length);
}
