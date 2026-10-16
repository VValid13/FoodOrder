import { IsUUID } from 'class-validator';
import * as crypto from 'crypto';

export class RefreshTokenSchema {
  @IsUUID()
  id: crypto.UUID;
  tokenHash: string;
  expireAt: Date;
  isActive: boolean;
  userId: crypto.UUID;
  createdAt: Date;
}
