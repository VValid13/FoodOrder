import { UserEntity } from './users.entity.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { USER_ROLES } from '../_utils/constants/user-role.constants.js';

@Injectable()
export class UserMapper {
  toGetUserDto = (user: UserEntity): GetUserDto => ({
    id: user.id,
    username: user.username,
  });

  formatUsername = (rawName: string): string =>
    rawName.trim().charAt(0).toUpperCase() + rawName.trim().slice(1).toLowerCase();

  toNewEntity = (createUserDto: CreateUserDto, hashedPass: string): UserEntity => ({
    id: crypto.randomUUID(),
    username: this.formatUsername(createUserDto.username),
    passwordHash: hashedPass,
    role: USER_ROLES.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
