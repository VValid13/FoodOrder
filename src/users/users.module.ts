import { forwardRef, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { UsersService } from './users.service.js';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { UsersRepository } from './users.repository.js';
import { UsersController } from './users.controller.js';

@Module({
  imports: [TerminusModule, forwardRef(() => JwtModule), EncryptionModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
