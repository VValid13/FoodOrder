import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('user_group')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('owner_id', 'uuid', (column) =>
      column.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('user_group_owner_id_index')
    .on('user_group')
    .column('owner_id')
    .execute();

  await db.schema
    .createTable('user_group_member')
    .addColumn('user_group_id', 'uuid', (column) =>
      column.notNull().references('user_group.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('user_group_member_pkey', ['user_group_id', 'user_id'])
    .execute();

  await db.schema
    .createIndex('user_group_member_user_id_index')
    .on('user_group_member')
    .column('user_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('user_group_member').execute();
  await db.schema.dropTable('user_group').execute();
}
