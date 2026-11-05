import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { ContactsController } from './contacts.controller.js';
import { ContactService } from './contacts.service.js';
import { ContactRepository } from './contacts.repository.js';
import { ContactMapper } from './contacts.mapper.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    forwardRef(() => JwtModule), EncryptionModule,
    UsersModule
  ],
  providers: [
    ContactService,
    ContactRepository,
    ContactMapper,
  ],
  controllers: [ContactsController],
})
export class ContactsModule {}
