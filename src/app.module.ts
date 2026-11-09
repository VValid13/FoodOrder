import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { validateEnv } from './_utils/config/env.config.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MenusModule } from './menus/menus.module.js';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { SessionsModule } from './sessions/sessions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    HealthModule,
    UsersModule,
    AuthModule,
    RestaurantsModule,
    MenusModule,
    SessionsModule,
  ],
})
export class AppModule {}
