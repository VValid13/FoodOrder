import { Injectable } from '@nestjs/common';
import type { CreateDishDto } from '../dtos/requests/create-dish.dto.js';
import type { OptionGroupDto } from '../dtos/requests/option-group.dto.js';
import type { UpdateDishDto } from '../dtos/requests/update-dish.dto.js';
import type { DishResponseDto } from '../dtos/responses/dish.response.dto.js';
import type { MenuResponseDto } from '../dtos/responses/menu.response.dto.js';
import type { DishDetails, MenuDetails } from '../types/menu-details.type.js';
import type { DishUpdate, NewDish, NewOptionGroup } from '../types/menu-values.type.js';

@Injectable()
export class MenuMapper {
  toNewDish({ optionGroups = [], ...values }: CreateDishDto): NewDish {
    return { values, optionGroups: this.toNewOptionGroups(optionGroups) };
  }

  toDishUpdate({ optionGroups, ...changes }: UpdateDishDto): DishUpdate {
    return {
      changes,
      optionGroups: optionGroups ? this.toNewOptionGroups(optionGroups) : undefined,
    };
  }

  toMenuResponse(menu: MenuDetails): MenuResponseDto {
    return {
      id: menu.id,
      name: menu.name,
      dishes: menu.dishes.map((dish) => this.toDishResponse(dish)),
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    };
  }

  toMenuResponseList = (menus: MenuDetails[]): MenuResponseDto[] =>
    menus.map((menu) => this.toMenuResponse(menu));

  toDishResponse(dish: DishDetails): DishResponseDto {
    return {
      id: dish.id,
      label: dish.label,
      category: dish.category,
      price: dish.price,
      available: dish.available,
      position: dish.position,
      optionGroups: dish.optionGroups.map((group) => ({
        id: group.id,
        label: group.label,
        required: group.required,
        maxChoices: group.maxChoices,
        options: group.options.map((option) => ({
          id: option.id,
          label: option.label,
          price: option.price,
        })),
      })),
    };
  }

  private toNewOptionGroups(optionGroups: OptionGroupDto[]): NewOptionGroup[] {
    return optionGroups.map(({ options, ...group }, groupPosition) => ({
      values: { ...group, position: groupPosition },
      options: options.map((option, optionPosition) => ({ ...option, position: optionPosition })),
    }));
  }
}
