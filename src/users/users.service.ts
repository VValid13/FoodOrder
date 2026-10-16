import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserEntity } from './users.entity.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { EncryptionService } from '../encryption/encryption.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneByUsername(this.userMapper.formatUsername(createUserDto.username));
    if (existingUser) {
      throw new HttpException('username already used', HttpStatus.BAD_REQUEST);
    }
    const newUserEntity: UserEntity = this.userMapper.toNewEntity(
        createUserDto,
        await this.encryptionService.encrypt(createUserDto.password)
    );
    const insertResult = this.userRepository.createUser(newUserEntity);
    if (!insertResult) {
      throw new HttpException('error while creating user', HttpStatus.NOT_FOUND);
    }
    return newUserEntity;
  }
  async getUserById(id: UUID) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  getUser = (user: UserEntity): GetUserDto => this.userMapper.toGetUserDto(user);
}
