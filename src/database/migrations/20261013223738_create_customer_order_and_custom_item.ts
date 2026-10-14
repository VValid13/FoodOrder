import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('customer_order')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('status', sql`order_status`, (column) => column.notNull().defaultTo('in_progress'))
    .addColumn('validated_at', 'timestamptz')
    .addColumn('total_price_cents', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('customer_order_total_price_cents_check', sql`total_price_cents >= 0`)
    .execute();

  await db.schema
    .createTable('custom_item')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('customer_order_id', 'uuid', (column) =>
      column.notNull().references('customer_order.id').onDelete('cascade'),
    )
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('comments', 'text')
    .addColumn('price_cents', 'integer', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('custom_item_price_cents_check', sql`price_cents >= 0`)
    .execute();

  await db.schema
    .createIndex('custom_item_customer_order_id_index')
    .on('custom_item')
    .column('customer_order_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('custom_item').execute();
  await db.schema.dropTable('customer_order').execute();
}
