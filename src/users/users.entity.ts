import * as crypto from 'crypto';
import type { UserRole } from '../database/database.types.js';

export class UserEntity {
  id: crypto.UUID;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
