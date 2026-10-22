import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { isUuid } from '../../../_utils/helpers/is-uuid.helper.js';
import { MenusExceptions } from '../exceptions/menus.exceptions.js';

@Injectable()
export class ParseDishIdPipe implements PipeTransform<string, UUID> {
  constructor(private readonly menusExceptions: MenusExceptions) {}

  transform(value: string): UUID {
    if (!isUuid(value)) {
      throw this.menusExceptions.invalidDishId(value);
    }
    return value;
  }
}
