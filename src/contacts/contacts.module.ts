import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { ContactsController } from './contacts.controller.js';
import { ContactService } from './contacts.service.js';
import { ContactRepository } from './contacts.repository.js';

@Module({
  imports: [forwardRef(() => JwtModule), EncryptionModule],
  providers: [ContactService, ContactRepository],
  //exports: [ContactService],
  controllers: [ContactsController],
})
export class ContactsModule {}
