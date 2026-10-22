import { BadRequestException, Injectable } from '@nestjs/common';
import { MAX_DISHES_PER_MENU } from '../constants/menus.constants.js';

export const TOO_MANY_DISHES_MESSAGE = `A menu cannot have more than ${MAX_DISHES_PER_MENU} dishes`;

@Injectable()
export class MenusExceptions {
  readonly tooManyDishes = new BadRequestException(TOO_MANY_DISHES_MESSAGE);

  invalidMenuId(menuId: string): BadRequestException {
    return new BadRequestException(`${menuId} is not a valid menu id`);
  }

  invalidDishId(dishId: string): BadRequestException {
    return new BadRequestException(`${dishId} is not a valid dish id`);
  }
}
