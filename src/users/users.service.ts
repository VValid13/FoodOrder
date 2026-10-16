import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserEntity } from './users.schema.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { EncryptionService } from '../encryption/encryption.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly encryptionService: EncryptionService,
  ) {}

  private capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  private formatUsername(rawName: string): string {
    let formatedName = rawName.charAt(0).toUpperCase();
    for (let x = 1, c = ''; (c = rawName.charAt(x)); x++) {
      formatedName += c.toLowerCase();
    }
    return formatedName;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneByUsername(createUserDto.username);
    if (existingUser !== undefined) {
      throw new HttpException('username already used', HttpStatus.BAD_REQUEST);
    }
    const hashedPass = await this.encryptionService.encrypt(createUserDto.password);
    const userInfo: UserEntity = {
      id: crypto.randomUUID(),
      username: this.formatUsername(createUserDto.username),
      passwordHash: hashedPass,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const insertResult = this.userRepository.createUser(userInfo);
    if (!insertResult) {
      throw new HttpException('error while creating user', HttpStatus.NOT_FOUND);
    } // Rework error
    return userInfo;
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
