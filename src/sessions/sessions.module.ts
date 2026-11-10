import { Module } from '@nestjs/common';
import { RestaurantsModule } from '../restaurants/restaurants.module.js';
import { SessionsExceptions } from './_utils/exceptions/sessions.exceptions.js';
import { SessionMapper } from './_utils/mappers/session.mapper.js';
import { SessionsController } from './sessions.controller.js';
import { SessionsRepository } from './sessions.repository.js';
import { SessionsService } from './sessions.service.js';

@Module({
  imports: [RestaurantsModule],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository, SessionMapper, SessionsExceptions],
  exports: [SessionsService],
})
export class SessionsModule {}
