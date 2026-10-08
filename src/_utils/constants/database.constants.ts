export const KYSELY_TOKEN = Symbol('KYSELY');
export const DATABASE_CONNECTION_TIMEOUT_MS = 5_000;
export const DATABASE_LOGGER_CONTEXT = 'Database';

export const MIGRATIONS_LOGGER_CONTEXT = 'Migrations';
export const MIGRATIONS_FOLDER_NAME = 'migrations';
export const MIGRATION_FILE_EXTENSION = '.ts';
export const MIGRATION_TEST_TARGET = 'test';
export const MIGRATION_NAME_PATTERN = /^[a-z0-9]+(_[a-z0-9]+)*$/;
export const MIGRATION_TIMESTAMP_LENGTH = 14;

export const MIGRATION_ACTIONS = ['latest', 'up', 'down'] as const;
export type MigrationAction = (typeof MIGRATION_ACTIONS)[number];
