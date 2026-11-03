import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.createType('user_role').asEnum(['user', 'admin']).execute();

  await db.schema
    .alterTable('user')
    .addColumn('role', sql`user_role`, (column) => column.notNull().defaultTo('user'))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('user').dropColumn('role').execute();
  await db.schema.dropType('user_role').execute();
}
