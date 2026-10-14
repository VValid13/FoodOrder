import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session_participant')
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('customer_order_id', 'uuid', (column) =>
      column.notNull().references('customer_order.id').onDelete('cascade'),
    )
    .addColumn('payback_method', sql`payback_method`)
    .addColumn('paid_back', 'boolean', (column) => column.notNull().defaultTo(false))
    .addColumn('status', sql`participant_status`, (column) => column.notNull().defaultTo('invited'))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('session_participant_pkey', [
      'session_id',
      'user_id',
      'customer_order_id',
    ])
    .execute();

  await db.schema
    .createIndex('session_participant_user_id_index')
    .on('session_participant')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('session_participant_customer_order_id_index')
    .on('session_participant')
    .column('customer_order_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('session_participant').execute();
}
