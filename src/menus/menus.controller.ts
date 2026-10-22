import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import {
  DISH_ID_PARAM,
  DISH_ID_ROUTE,
  DISHES_ROUTE,
  MENU_ID_PARAM,
  MENU_ID_ROUTE,
  MENUS_ROUTE,
  MENUS_TAG,
} from './_utils/constants/menus.constants.js';
import { CreateDishDto } from './_utils/dtos/requests/create-dish.dto.js';
import { CreateMenuDto } from './_utils/dtos/requests/create-menu.dto.js';
import { UpdateDishDto } from './_utils/dtos/requests/update-dish.dto.js';
import { UpdateMenuDto } from './_utils/dtos/requests/update-menu.dto.js';
import { MenuResponseDto } from './_utils/dtos/responses/menu.response.dto.js';
import { TOO_MANY_DISHES_MESSAGE } from './_utils/exceptions/menus.exceptions.js';
import { ParseDishIdPipe } from './_utils/pipes/parse-dish-id.pipe.js';
import { ParseMenuPipe } from './_utils/pipes/parse-menu.pipe.js';
import type { MenuDetails } from './_utils/types/menu-details.type.js';
import { MenusService } from './menus.service.js';

@ApiTags(MENUS_TAG)
@Controller(MENUS_ROUTE)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Protect()
  @Post()
  @ApiOperation({ summary: 'Create a menu' })
  @ApiCreatedResponse({ type: MenuResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  async createMenu(@Body() createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    return await this.menusService.createMenu(createMenuDto);
  }

  @Protect()
  @Get()
  @ApiOperation({ summary: 'List menus with their dishes' })
  @ApiOkResponse({ type: [MenuResponseDto] })
  async findAllMenus(): Promise<MenuResponseDto[]> {
    return await this.menusService.findAllMenus();
  }

  @Protect()
  @Get(MENU_ID_ROUTE)
  @ApiOperation({ summary: 'Get a menu with its dishes sorted by category then position' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: MenuResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid menu id' })
  @ApiNotFoundResponse({ description: 'Menu not found' })
  findMenu(@Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails): MenuResponseDto {
    return this.menusService.findMenu(menu);
  }

  @Protect()
  @Patch(MENU_ID_ROUTE)
  @ApiOperation({ summary: 'Rename a menu' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: MenuResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid menu id or body' })
  @ApiNotFoundResponse({ description: 'Menu not found' })
  async updateMenu(
    @Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    return await this.menusService.updateMenu(menu, updateMenuDto);
  }

  @Protect()
  @Delete(MENU_ID_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a menu and its dishes' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: 'Menu deleted' })
  @ApiBadRequestResponse({ description: 'Invalid menu id' })
  @ApiNotFoundResponse({ description: 'Menu not found' })
  @ApiConflictResponse({ description: 'Menu used by a restaurant or dish already ordered' })
  async deleteMenu(@Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails): Promise<void> {
    await this.menusService.deleteMenu(menu);
  }

  @Protect()
  @Post(DISHES_ROUTE)
  @ApiOperation({ summary: 'Add a dish with its option groups to a menu' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiCreatedResponse({ type: MenuResponseDto })
  @ApiBadRequestResponse({ description: `Invalid menu id or body. ${TOO_MANY_DISHES_MESSAGE}` })
  @ApiNotFoundResponse({ description: 'Menu not found' })
  async createDish(
    @Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails,
    @Body() createDishDto: CreateDishDto,
  ): Promise<MenuResponseDto> {
    return await this.menusService.createDish(menu, createDishDto);
  }

  @Protect()
  @Patch(DISH_ID_ROUTE)
  @ApiOperation({ summary: 'Update a dish, optionGroups replaces every option group' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiParam({ name: DISH_ID_PARAM, format: 'uuid' })
  @ApiOkResponse({ type: MenuResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid ids or body' })
  @ApiNotFoundResponse({ description: 'Menu or dish not found' })
  @ApiConflictResponse({ description: 'Options of an already ordered dish cannot be replaced' })
  async updateDish(
    @Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails,
    @Param(DISH_ID_PARAM, ParseDishIdPipe) dishId: UUID,
    @Body() updateDishDto: UpdateDishDto,
  ): Promise<MenuResponseDto> {
    return await this.menusService.updateDish(menu, dishId, updateDishDto);
  }

  @Protect()
  @Delete(DISH_ID_ROUTE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a dish from a menu, already ordered items keep it' })
  @ApiParam({ name: MENU_ID_PARAM, format: 'uuid' })
  @ApiParam({ name: DISH_ID_PARAM, format: 'uuid' })
  @ApiNoContentResponse({ description: 'Dish removed' })
  @ApiBadRequestResponse({ description: 'Invalid ids' })
  @ApiNotFoundResponse({ description: 'Menu or dish not found' })
  async deleteDish(
    @Param(MENU_ID_PARAM, ParseMenuPipe) menu: MenuDetails,
    @Param(DISH_ID_PARAM, ParseDishIdPipe) dishId: UUID,
  ): Promise<void> {
    await this.menusService.deleteDish(menu, dishId);
  }
}
