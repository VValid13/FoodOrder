import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller.js';
import { ContactService } from './contacts.service.js';
import { ContactRepository } from './contacts.repository.js';
import { ContactMapper } from './contacts.mapper.js';
import { UsersModule } from '../users/users.module.js';
import { ContactsExceptions } from './_utils/exceptions/contacts.exceptions.js';

@Module({
  imports: [UsersModule],
  providers: [ContactService, ContactRepository, ContactMapper, ContactsExceptions],
  controllers: [ContactsController],
})
export class ContactsModule {}
