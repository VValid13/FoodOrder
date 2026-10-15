import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserSchema } from './users.schema.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
  ) {}
  createUser = (createUserDto: CreateUserDto) =>
    this.userRepository.createUser(createUserDto).then(this.userMapper.toGetUserDto);
  getUserById = (id: UUID) => this.userRepository.findById(id);
  getUser = (user: UserSchema): GetUserDto => this.userMapper.toGetUserDto(user);
}
