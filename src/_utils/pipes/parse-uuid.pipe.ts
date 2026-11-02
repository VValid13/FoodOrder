import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { UUIDFormatException } from '../global.exception.js';
import { isUuid } from '../helpers/is-uuid.helper.js';

@Injectable()
export class ParseUuidPipe implements PipeTransform<string, UUID> {
  transform(value: string): UUID {
    if (!isUuid(value)) {
      throw UUIDFormatException;
    }
    return value;
  }
}
