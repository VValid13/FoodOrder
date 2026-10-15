import { UserSchema } from './users.schema.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: UserSchema): GetUserDto => ({
    id: user.id,
    username: user.username,
  });
}
