import { Injectable } from '@nestjs/common';
import { RefreshTokenSchema } from './schemas/refresh-token.schema.js';
import { TokenTable } from '../database/database.types.js';
import {UserSchema} from "../users/users.schema.js";

@Injectable()
export class AuthMapper {
  toJwTokenInterface = (user: UserSchema) =>({
    id: user.id,
    username: user.username,
  })
}
