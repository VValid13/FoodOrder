import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session_member')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('status', sql`member_status`, (column) => column.notNull().defaultTo('active'))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('session_member_session_id_user_id_unique', ['session_id', 'user_id'])
    .execute();

  await db.schema
    .createIndex('session_member_user_id_index')
    .on('session_member')
    .column('user_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('session_member').execute();
}
