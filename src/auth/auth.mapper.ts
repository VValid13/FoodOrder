import { Injectable } from '@nestjs/common';
import { UserEntity } from '../users/users.schema.js';

@Injectable()
export class AuthMapper {
  toJwTokenInterface = (user: UserEntity) => ({
    id: user.id,
    username: user.username,
  });
}
