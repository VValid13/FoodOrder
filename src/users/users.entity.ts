import * as crypto from 'crypto';

export class UserEntity {
  id: crypto.UUID;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
