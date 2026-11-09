import type { UserRole } from '../../../database/database.types.js';

export type ProtectOptions = {
  roles?: UserRole[];
};
