import { Injectable } from '@nestjs/common';
import { UserSchema } from '../users/users.schema.js';

@Injectable()
export class AuthMapper {
  toJwTokenInterface = (user: UserSchema) => ({
    id: user.id,
    username: user.username,
  });
}
