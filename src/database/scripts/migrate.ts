import { Logger } from '@nestjs/common';
import {
  MIGRATION_ACTIONS,
  MIGRATION_TEST_TARGET,
  MIGRATIONS_LOGGER_CONTEXT,
} from '../../_utils/constants/database.constants.js';
import type { MigrationAction } from '../../_utils/constants/database.constants.js';
import { ENV_KEYS } from '../../_utils/constants/env.constants.js';
import { getRequiredEnv } from '../../_utils/helpers/get-required-env.helper.js';
import { createDatabase } from '../create-database.js';
import { runMigrations } from '../migrator.js';

const logger = new Logger(MIGRATIONS_LOGGER_CONTEXT);

function isMigrationAction(value: string | undefined): value is MigrationAction {
  return MIGRATION_ACTIONS.some((action) => action === value);
}

async function main(): Promise<void> {
  const [action, target] = process.argv.slice(2);

  if (!isMigrationAction(action)) {
    throw new Error(`Unknown migration action. Expected one of: ${MIGRATION_ACTIONS.join(', ')}`);
  }

  const envKey = ENV_KEYS.DATABASE_URL;
  //  target === MIGRATION_TEST_TARGET ? ENV_KEYS.DATABASE_URL_TEST :ENV_KEYS.DATABASE_URL;
  const db = createDatabase(getRequiredEnv(envKey));

  try {
    logger.log(`Running "${action}" on ${envKey}`);
    await runMigrations(db, action);
  } finally {
    await db.destroy();
  }
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
