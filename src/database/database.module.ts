import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../_utils/config/env.config.js';
import { Kysely } from 'kysely';
import { KYSELY_TOKEN } from '../_utils/constants/database.constants.js';
import { ENV_KEYS } from '../_utils/constants/env.constants.js';
import { createDatabase } from './create-database.js';
import type { DB } from './database.types.js';

@Global()
@Module({
  providers: [
    {
      provide: KYSELY_TOKEN,
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ): Kysely<DB> =>
        createDatabase(configService.getOrThrow(ENV_KEYS.DATABASE_URL, { infer: true })),
    },
  ],
  exports: [KYSELY_TOKEN],
})
export class DatabaseModule {}
