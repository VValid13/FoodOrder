import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('creator_id', 'uuid', (column) =>
      column.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('restaurant_id', 'uuid', (column) =>
      column.notNull().references('restaurant.id').onDelete('no action'),
    )
    .addColumn('time_limit', 'timestamptz', (column) => column.notNull())
    .addColumn('status', sql`session_status`, (column) => column.notNull().defaultTo('draft'))
    .addColumn('approx_delivery_time', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('session_creator_id_index')
    .on('session')
    .column('creator_id')
    .execute();

  await db.schema
    .createIndex('session_restaurant_id_index')
    .on('session')
    .column('restaurant_id')
    .execute();

  await db.schema
    .createIndex('session_status_time_limit_index')
    .on('session')
    .columns(['status', 'time_limit'])
    .execute();

  await db.schema
    .createTable('invitation')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('recipient_id', 'uuid', (column) => column.references('user.id').onDelete('cascade'))
    .addColumn('token_hash', 'text', (column) => column.notNull().unique())
    .addColumn('status', sql`invitation_status`, (column) => column.notNull().defaultTo('pending'))
    .addColumn('expires_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('invitation_session_id_index')
    .on('invitation')
    .column('session_id')
    .execute();

  await db.schema
    .createIndex('invitation_recipient_id_index')
    .on('invitation')
    .column('recipient_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('invitation').execute();
  await db.schema.dropTable('session').execute();
}
