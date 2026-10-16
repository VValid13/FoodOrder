import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('customer_order')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('session_member_id', 'uuid', (column) =>
      column.notNull().unique().references('session_member.id').onDelete('cascade'),
    )
    .addColumn('status', sql`order_status`, (column) => column.notNull().defaultTo('in_progress'))
    .addColumn('validated_at', 'timestamptz')
    .addColumn('total_price', 'real', (column) => column.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('customer_order_total_price_check', sql`total_price >= 0`)
    .execute();

  await db.schema
    .createTable('order_item')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('customer_order_id', 'uuid', (column) =>
      column.notNull().references('customer_order.id').onDelete('cascade'),
    )
    .addColumn('dish_id', 'uuid', (column) =>
      column.notNull().references('dish.id').onDelete('no action'),
    )
    .addColumn('quantity', 'integer', (column) => column.notNull().defaultTo(1))
    .addColumn('unit_price', 'real', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('order_item_quantity_check', sql`quantity > 0`)
    .addCheckConstraint('order_item_unit_price_check', sql`unit_price >= 0`)
    .execute();

  await db.schema
    .createIndex('order_item_customer_order_id_index')
    .on('order_item')
    .column('customer_order_id')
    .execute();

  await db.schema
    .createIndex('order_item_dish_id_index')
    .on('order_item')
    .column('dish_id')
    .execute();

  await db.schema
    .createTable('order_item_option')
    .addColumn('order_item_id', 'uuid', (column) =>
      column.notNull().references('order_item.id').onDelete('cascade'),
    )
    .addColumn('option_id', 'uuid', (column) =>
      column.notNull().references('option.id').onDelete('no action'),
    )
    .addPrimaryKeyConstraint('order_item_option_pkey', ['order_item_id', 'option_id'])
    .execute();

  await db.schema
    .createIndex('order_item_option_option_id_index')
    .on('order_item_option')
    .column('option_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('order_item_option').execute();
  await db.schema.dropTable('order_item').execute();
  await db.schema.dropTable('customer_order').execute();
}
