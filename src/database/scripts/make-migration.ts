import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Logger } from '@nestjs/common';
import {
  MIGRATION_FILE_EXTENSION,
  MIGRATION_NAME_PATTERN,
  MIGRATION_TIMESTAMP_LENGTH,
  MIGRATIONS_LOGGER_CONTEXT,
} from '../../_utils/constants/database.constants.js';
import { MIGRATIONS_FOLDER } from '../migrator.js';

const logger = new Logger(MIGRATIONS_LOGGER_CONTEXT);

const MIGRATION_TEMPLATE = `import type { Kysely } from 'kysely';

export async function up(_db: Kysely<unknown>): Promise<void> {}

export async function down(_db: Kysely<unknown>): Promise<void> {}
`;

function buildTimestamp(date: Date): string {
  return date.toISOString().replace(/\D/g, '').slice(0, MIGRATION_TIMESTAMP_LENGTH);
}

async function main(): Promise<void> {
  const [name] = process.argv.slice(2);

  if (!name || !MIGRATION_NAME_PATTERN.test(name)) {
    throw new Error('Usage: pnpm migrate:make <migration_name_in_snake_case>');
  }

  const fileName = `${buildTimestamp(new Date())}_${name}${MIGRATION_FILE_EXTENSION}`;
  const filePath = path.join(MIGRATIONS_FOLDER, fileName);

  if (existsSync(filePath)) {
    throw new Error(`Migration already exists: ${fileName}`);
  }

  await writeFile(filePath, MIGRATION_TEMPLATE);
  logger.log(`Created ${path.relative(process.cwd(), filePath)}`);
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
