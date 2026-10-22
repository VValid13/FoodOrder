import { Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { isUuid } from '../../../_utils/helpers/is-uuid.helper.js';
import { MenusRepository } from '../../menus.repository.js';
import { MenusExceptions } from '../exceptions/menus.exceptions.js';
import type { MenuDetails } from '../types/menu-details.type.js';

@Injectable()
export class ParseMenuPipe implements PipeTransform<string, Promise<MenuDetails>> {
  constructor(
    private readonly menusRepository: MenusRepository,
    private readonly menusExceptions: MenusExceptions,
  ) {}

  async transform(value: string): Promise<MenuDetails> {
    if (!isUuid(value)) {
      throw this.menusExceptions.invalidMenuId(value);
    }
    return await this.menusRepository.findMenuByIdOrFail(value);
  }
}
