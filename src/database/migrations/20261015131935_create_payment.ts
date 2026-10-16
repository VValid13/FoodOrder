import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('payment')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('payer_id', 'uuid', (column) =>
      column.notNull().references('session_member.id').onDelete('cascade'),
    )
    .addColumn('receiver_id', 'uuid', (column) =>
      column.notNull().references('session_member.id').onDelete('cascade'),
    )
    .addColumn('amount', 'real', (column) => column.notNull())
    .addColumn('method', sql`payment_method`, (column) => column.notNull())
    .addColumn('paid_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('payment_amount_check', sql`amount > 0`)
    .addCheckConstraint('payment_payer_not_receiver_check', sql`payer_id <> receiver_id`)
    .execute();

  await db.schema.createIndex('payment_payer_id_index').on('payment').column('payer_id').execute();

  await db.schema
    .createIndex('payment_receiver_id_index')
    .on('payment')
    .column('receiver_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('payment').execute();
}
