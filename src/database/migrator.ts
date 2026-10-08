import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '@nestjs/common';
import type { Kysely } from 'kysely';
import type { MigrationResultSet } from 'kysely/migration';
import { FileMigrationProvider, Migrator } from 'kysely/migration';
import {
  MIGRATIONS_FOLDER_NAME,
  MIGRATIONS_LOGGER_CONTEXT,
} from '../_utils/constants/database.constants.js';
import type { MigrationAction } from '../_utils/constants/database.constants.js';

export const MIGRATIONS_FOLDER = fileURLToPath(new URL(MIGRATIONS_FOLDER_NAME, import.meta.url));

const logger = new Logger(MIGRATIONS_LOGGER_CONTEXT);

function migrate(migrator: Migrator, action: MigrationAction): Promise<MigrationResultSet> {
  switch (action) {
    case 'latest':
      return migrator.migrateToLatest();
    case 'up':
      return migrator.migrateUp();
    case 'down':
      return migrator.migrateDown();
  }
}

export async function runMigrations<T>(db: Kysely<T>, action: MigrationAction): Promise<void> {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({ fs, path, migrationFolder: MIGRATIONS_FOLDER }),
  });

  const { error, results } = await migrate(migrator, action);

  for (const result of results ?? []) {
    if (result.status === 'Success') {
      logger.log(`${result.direction} ${result.migrationName}: success`);
    } else if (result.status === 'Error') {
      logger.error(`${result.direction} ${result.migrationName}: failed`);
    }
  }

  if (results?.length === 0) {
    logger.log('No migration to run');
  }

  if (error) {
    throw error;
  }
}
