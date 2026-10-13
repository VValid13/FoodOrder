import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    //private readonly userMapper: UserMapper,
  ) {}
  createUser = (createUserDto: CreateUserDto) => this.userRepository.create(createUserDto); // then() use Mapper
  getUserById = (id: UUID) => this.userRepository.findById(id);
}
