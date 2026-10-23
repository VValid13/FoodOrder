import { createHash } from 'node:crypto';

export class hashTokenHelper {
  hashRefreshToken = (rawToken: string) => createHash('sha256').update(rawToken).digest('hex');
}
