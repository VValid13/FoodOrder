import { Module } from '@nestjs/common';
import { MenuMapper } from './_utils/mappers/menu.mapper.js';
import { MenusController } from './menus.controller.js';
import { MenusRepository } from './menus.repository.js';
import { MenusService } from './menus.service.js';

@Module({
  controllers: [MenusController],
  providers: [MenusService, MenusRepository, MenuMapper],
  exports: [MenusService],
})
export class MenusModule {}
