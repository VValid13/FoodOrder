import { Injectable } from '@nestjs/common';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import type { Menu } from '../database/database.types.js';
import type { CreateDishDto } from './_utils/dtos/requests/create-dish.dto.js';
import type { CreateMenuDto } from './_utils/dtos/requests/create-menu.dto.js';
import type { UpdateDishDto } from './_utils/dtos/requests/update-dish.dto.js';
import type { UpdateMenuDto } from './_utils/dtos/requests/update-menu.dto.js';
import type { MenuResponseDto } from './_utils/dtos/responses/menu.response.dto.js';
import { MenuMapper } from './_utils/mappers/menu.mapper.js';
import { MenusRepository } from './menus.repository.js';

@Injectable()
export class MenusService {
  constructor(
    private readonly menusRepository: MenusRepository,
    private readonly menuMapper: MenuMapper,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    const menu = await this.menusRepository.createMenu(createMenuDto);
    return this.menuMapper.toMenuResponse({ ...menu, dishes: [] });
  }

  async findAllMenus(): Promise<MenuResponseDto[]> {
    return this.menuMapper.toMenuResponseList(await this.menusRepository.findAllMenus());
  }

  async findMenuById(menuId: UUID): Promise<MenuResponseDto> {
    return this.menuMapper.toMenuResponse(await this.menusRepository.findMenuByIdOrFail(menuId));
  }

  async updateMenu(menu: Selectable<Menu>, updateMenuDto: UpdateMenuDto): Promise<MenuResponseDto> {
    await this.menusRepository.updateMenu(menu.id, updateMenuDto);
    return await this.findMenuById(menu.id);
  }

  async deleteMenu(menu: Selectable<Menu>): Promise<void> {
    await this.menusRepository.deleteMenu(menu.id);
  }

  async createDish(menu: Selectable<Menu>, createDishDto: CreateDishDto): Promise<MenuResponseDto> {
    await this.menusRepository.createDish(menu.id, this.menuMapper.toNewDish(createDishDto));
    return await this.findMenuById(menu.id);
  }

  async updateDish(
    menu: Selectable<Menu>,
    dishId: UUID,
    updateDishDto: UpdateDishDto,
  ): Promise<MenuResponseDto> {
    const dish = await this.menusRepository.findDishByIdOrFail(menu.id, dishId);
    await this.menusRepository.updateDish(dish.id, this.menuMapper.toDishUpdate(updateDishDto));
    return await this.findMenuById(menu.id);
  }

  async deleteDish(menu: Selectable<Menu>, dishId: UUID): Promise<void> {
    const dish = await this.menusRepository.findDishByIdOrFail(menu.id, dishId);
    await this.menusRepository.deleteDish(dish.id);
  }
}
