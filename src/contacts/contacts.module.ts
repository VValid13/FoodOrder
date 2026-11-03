import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { ContactsController } from './contacts.controller.js';
import { ContactService } from './contacts.service.js';
import { ContactRepository } from './contacts.repository.js';
import { UserMapper } from '../users/users.mapper.js';
import { UsersService } from '../users/users.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { ContactMapper } from './contacts.mapper.js';

@Module({
  imports: [forwardRef(() => JwtModule), EncryptionModule],
  providers: [
    ContactService,
    ContactRepository,
    ContactMapper,
    UserMapper,
    UsersService,
    UsersRepository,
  ],
  //exports: [ContactService],
  controllers: [ContactsController],
})
export class ContactsModule {}
