import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserEntity } from './users.entity.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { EncryptionService } from '../encryption/encryption.service.js';
import { hashTokenHelper } from '../_utils/helpers/hash-token.helper.js';
import { ChangeUsernameDto } from './_utils/dtos/requests/change-username.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly encryptionService: EncryptionService,
    private readonly hashTokenHelper: hashTokenHelper,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUserEntity: UserEntity = this.userMapper.toNewEntity(
      createUserDto,
      await this.encryptionService.encrypt(createUserDto.password),
    );
    await this.userRepository.createUser(newUserEntity);
  }
  async getUserById(id: UUID) {
    return await this.userRepository.findById(id);
  }
  async getUserByIdOrUnauthorized(id: UUID) {
    try {
      return await this.userRepository.findById(id);
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
  async getSelfUserByToken(token: string) {
    try {
      return await this.userRepository.findById(
        await this.userRepository.findUseridByValidTokenHash(
          this.hashTokenHelper.hashRefreshToken(token),
        ),
      );
    } catch {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }
  }
  async getUserByUsername(username: string) {
    return await this.userRepository.findOneByUsername(this.userMapper.formatUsername(username));
  }
  async getUserByUsernameOrUnauthorized(username: string) {
    try {
      return await this.userRepository.findOneByUsername(this.userMapper.formatUsername(username));
    } catch {
      throw new UnauthorizedException('INVALID CREDENTIALS');
    }
  }
  getUser = (user: UserEntity): GetUserDto => this.userMapper.toGetUserDto(user);

  async updateSelfUsername(changeUsernameDto: ChangeUsernameDto, userId: UUID) {
    await this.userRepository.updateUsername(changeUsernameDto, userId);
  }
}
