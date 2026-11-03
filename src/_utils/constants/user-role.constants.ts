import type { UserRole } from '../../database/database.types.js';

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const satisfies Record<string, UserRole>;
