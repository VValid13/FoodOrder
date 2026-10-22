import { Injectable } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { MAX_DISHES_PER_MENU } from './_utils/constants/menus.constants.js';
import type { CreateDishDto } from './_utils/dtos/requests/create-dish.dto.js';
import type { CreateMenuDto } from './_utils/dtos/requests/create-menu.dto.js';
import type { UpdateDishDto } from './_utils/dtos/requests/update-dish.dto.js';
import type { UpdateMenuDto } from './_utils/dtos/requests/update-menu.dto.js';
import type { MenuResponseDto } from './_utils/dtos/responses/menu.response.dto.js';
import { MenusExceptions } from './_utils/exceptions/menus.exceptions.js';
import { MenuMapper } from './_utils/mappers/menu.mapper.js';
import type { MenuDetails } from './_utils/types/menu-details.type.js';
import { MenusRepository } from './menus.repository.js';

@Injectable()
export class MenusService {
  constructor(
    private readonly menusRepository: MenusRepository,
    private readonly menusExceptions: MenusExceptions,
    private readonly menuMapper: MenuMapper,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    const menuId = await this.menusRepository.createMenu(createMenuDto);
    return await this.findMenuById(menuId);
  }

  async findAllMenus(): Promise<MenuResponseDto[]> {
    return this.menuMapper.toMenuResponseList(await this.menusRepository.findAllMenus());
  }

  findMenu(menu: MenuDetails): MenuResponseDto {
    return this.menuMapper.toMenuResponse(menu);
  }

  async updateMenu(menu: MenuDetails, updateMenuDto: UpdateMenuDto): Promise<MenuResponseDto> {
    await this.menusRepository.updateMenu(menu.id, updateMenuDto);
    return await this.findMenuById(menu.id);
  }

  async deleteMenu(menu: MenuDetails): Promise<void> {
    await this.menusRepository.deleteMenu(menu.id);
  }

  async createDish(menu: MenuDetails, createDishDto: CreateDishDto): Promise<MenuResponseDto> {
    if ((await this.menusRepository.countActiveDishes(menu.id)) >= MAX_DISHES_PER_MENU) {
      throw this.menusExceptions.tooManyDishes;
    }
    await this.menusRepository.createDish(menu.id, this.menuMapper.toNewDish(createDishDto));
    return await this.findMenuById(menu.id);
  }

  async updateDish(
    menu: MenuDetails,
    dishId: UUID,
    updateDishDto: UpdateDishDto,
  ): Promise<MenuResponseDto> {
    const dish = await this.menusRepository.findDishByIdOrFail(menu.id, dishId);
    await this.menusRepository.updateDish(dish.id, this.menuMapper.toDishUpdate(updateDishDto));
    return await this.findMenuById(menu.id);
  }

  async deleteDish(menu: MenuDetails, dishId: UUID): Promise<void> {
    const dish = await this.menusRepository.findDishByIdOrFail(menu.id, dishId);
    await this.menusRepository.deleteDish(dish.id);
  }

  async findMenuById(menuId: UUID): Promise<MenuResponseDto> {
    return this.menuMapper.toMenuResponse(await this.menusRepository.findMenuByIdOrFail(menuId));
  }
}
