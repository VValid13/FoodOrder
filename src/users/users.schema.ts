import * as crypto from 'crypto';
import { IsUUID } from 'class-validator';

export class UserSchema {
  @IsUUID()
  id: crypto.UUID;
  username: string;
  password_hash: string;
}
