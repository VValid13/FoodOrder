import { Logger } from '@nestjs/common';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import {
  DATABASE_CONNECTION_TIMEOUT_MS,
  DATABASE_LOGGER_CONTEXT,
} from '../_utils/constants/database.constants.js';
import type { DatabaseTables } from './database.types.js';

const logger = new Logger(DATABASE_LOGGER_CONTEXT);

export function createDatabase(connectionString: string): Kysely<DatabaseTables> {
  const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: DATABASE_CONNECTION_TIMEOUT_MS,
  });

  pool.on('error', (error) => {
    logger.error(`PostgreSQL pool error: ${error.message}`, error.stack);
  });

  return new Kysely<DatabaseTables>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin()],
  });
}
