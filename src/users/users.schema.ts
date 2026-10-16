import * as crypto from 'crypto';
import { IsUUID } from 'class-validator';

export class UserEntity {
  @IsUUID()
  id: crypto.UUID;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
