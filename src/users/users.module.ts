import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { UsersRepository } from './users.repository.js';
import { UsersController } from './users.controller.js';
import { UserMapper } from './users.mapper.js';
import { hashTokenHelper } from '../_utils/helpers/hash-token.helper.js';

@Module({
  imports: [forwardRef(() => JwtModule), EncryptionModule],
  providers: [UsersService, UsersRepository, UserMapper, hashTokenHelper],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
