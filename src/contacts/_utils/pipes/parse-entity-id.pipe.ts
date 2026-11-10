import { type UUID } from 'crypto';
import { ContactsExceptions } from '../exceptions/contacts.exceptions.js';
import { Injectable, PipeTransform } from '@nestjs/common';
import { isUuid } from '../../../_utils/helpers/is-uuid.helper.js';

@Injectable()
export class ParseEntityIdPipe implements PipeTransform<string, Promise<UUID>> {
  constructor(private readonly contactsExceptions: ContactsExceptions) {}

  async transform(value: string): Promise<UUID> {
    if (!isUuid(value)) {
      throw this.contactsExceptions.invalidEntityId(value);
    }
    return value;
  }
}
