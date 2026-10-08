import { ENV_FILE_PATH, ENV_KEYS } from '../../src/_utils/constants/env.constants.js';
import { getRequiredEnv } from '../../src/_utils/helpers/get-required-env.helper.js';
import { createDatabase } from '../../src/database/create-database.js';
import { runMigrations } from '../../src/database/migrator.js';

export default async function setup(): Promise<void> {
  process.loadEnvFile(ENV_FILE_PATH);

  const db = createDatabase(getRequiredEnv(ENV_KEYS.DATABASE_URL_TEST));
  try {
    await runMigrations(db, 'latest');
  } finally {
    await db.destroy();
  }
}
