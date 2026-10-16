import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserSchema } from './users.schema.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import {EncryptionService} from "../encryption/encryption.service.js";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly encryptionService: EncryptionService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserSchema> {
    const hashedPass = await this.encryptionService.encrypt(createUserDto.password);
    const userInfo: UserSchema = {
      id : crypto.randomUUID(),
      username: createUserDto.username,
      passwordHash :hashedPass,
    }
    const insertResult = this.userRepository.createUser(userInfo);
    if(!insertResult){ throw new HttpException('error while creating user', HttpStatus.NOT_FOUND); } // Rework error
    return userInfo;
  }
  async getUserById(id: UUID) {
    this.userMapper.toGetUserDto(await this.userRepository.findById(id));
  }
  getUser = (user: UserSchema): GetUserDto => this.userMapper.toGetUserDto(user);
}
