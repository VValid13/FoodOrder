import { UserEntity } from './users.schema.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: UserEntity): GetUserDto => ({
    id: user.id,
    username: user.username,
  });
}
