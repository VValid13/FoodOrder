import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('app_user')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('username', 'text', (column) => column.notNull().unique())
    .addColumn('password_hash', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('token')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('token_hash', 'text', (column) => column.notNull().unique())
    .addColumn('is_active', 'boolean', (column) => column.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('token_user_id_index').on('token').column('user_id').execute();

  await db.schema
    .createTable('user_group')
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('member_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('user_group_pkey', ['user_id', 'member_id'])
    .addCheckConstraint('user_group_not_self_check', sql`user_id <> member_id`)
    .execute();

  await db.schema
    .createIndex('user_group_member_id_index')
    .on('user_group')
    .column('member_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('user_group').execute();
  await db.schema.dropTable('token').execute();
  await db.schema.dropTable('app_user').execute();
}
