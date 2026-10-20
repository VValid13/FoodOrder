import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto.js';
import { UUID } from 'crypto';
import { UsersRepository } from './users.repository.js';
import { UserMapper } from './users.mapper.js';
import { UserEntity } from './users.entity.js';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto.js';
import { EncryptionService } from '../encryption/encryption.service.js';
import {KyselyError} from "../_utils/filters/postgres.exeption.filter.js";
import {ERROR_KEYS} from "../_utils/constants/error-code.constants.js";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userMapper: UserMapper,
    private readonly encryptionService: EncryptionService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUserEntity: UserEntity = this.userMapper.toNewEntity(
      createUserDto,
      await this.encryptionService.encrypt(createUserDto.password),
    );
    await this.userRepository.createUser(newUserEntity);
    return newUserEntity;
  }
  async getUserById(id: UUID) {
    return await this.userRepository.findById(id);
  }
  async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new KyselyError(
          ERROR_KEYS.NO_RESULT_ERROR,
          "Username not found for user",
      )
    }
    return user;
  }
  async getUserByUsernameOrUnauthorized(username: string) {
    try{
      return await this.userRepository.findOneByUsername(username);
    }catch (_err){
      //console.log(err)
      throw new UnauthorizedException('INVALID CREDENTIALS')
    }
  }
  getUser = (user: UserEntity): GetUserDto => this.userMapper.toGetUserDto(user);
}
