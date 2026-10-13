import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('resto_id', 'uuid', (column) =>
      column.notNull().references('resto.id').onDelete('no action'),
    )
    .addColumn('time_limit', 'timestamptz', (column) => column.notNull())
    .addColumn('status', sql`session_status`, (column) => column.notNull().defaultTo('draft'))
    .addColumn('approx_delivery_time', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('session_user_id_index').on('session').column('user_id').execute();

  await db.schema.createIndex('session_resto_id_index').on('session').column('resto_id').execute();

  await db.schema
    .createIndex('session_status_time_limit_index')
    .on('session')
    .columns(['status', 'time_limit'])
    .execute();

  await db.schema
    .createTable('payers')
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('payers_pkey', ['session_id', 'user_id'])
    .execute();

  await db.schema.createIndex('payers_user_id_index').on('payers').column('user_id').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('payers').execute();
  await db.schema.dropTable('session').execute();
}
