import { Module } from '@nestjs/common';
import { MenusExceptions } from './_utils/exceptions/menus.exceptions.js';
import { MenuMapper } from './_utils/mappers/menu.mapper.js';
import { ParseDishIdPipe } from './_utils/pipes/parse-dish-id.pipe.js';
import { ParseMenuPipe } from './_utils/pipes/parse-menu.pipe.js';
import { MenusController } from './menus.controller.js';
import { MenusRepository } from './menus.repository.js';
import { MenusService } from './menus.service.js';

@Module({
  controllers: [MenusController],
  providers: [
    MenusService,
    MenusRepository,
    MenusExceptions,
    MenuMapper,
    ParseMenuPipe,
    ParseDishIdPipe,
  ],
  exports: [MenusService],
})
export class MenusModule {}
