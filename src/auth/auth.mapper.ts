import { Injectable } from '@nestjs/common';
import { RefreshTokenSchema } from './schemas/refresh-token.schema.js';
import { TokenTable } from '../database/database.types.js';

@Injectable()
export class AuthMapper {
  toRefreshTokenSchema(result: TokenTable): RefreshTokenSchema {
    const schema: RefreshTokenSchema = {
      id: crypto.randomUUID(), //result.id, // SO NEST WONT COMPLAIN
      id_user: result.id_user,
      token: result.token,
      expireAt: result.expireAt,
      status: result.status,
    };
    return schema;
  }
}
