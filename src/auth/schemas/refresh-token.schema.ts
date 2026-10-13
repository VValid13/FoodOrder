import { IsUUID } from 'class-validator';
import * as crypto from 'crypto';

export class RefreshTokenSchema {
  @IsUUID()
  id: crypto.UUID;
  token: string;
  expireAt: Date;
  status: boolean;
  id_user: crypto.UUID;
}
