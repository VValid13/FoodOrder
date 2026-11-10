import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { validateEnv } from './_utils/config/env.config.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MenusModule } from './menus/menus.module.js';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { CronsModule } from './crons/crons.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    UsersModule,
    ContactsModule,
    AuthModule,
    RestaurantsModule,
    MenusModule,
    SessionsModule,
    CronsModule,
  ],
})
export class AppModule {}
