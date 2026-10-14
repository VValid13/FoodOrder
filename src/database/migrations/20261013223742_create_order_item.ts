import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('order_item')
    .addColumn('dish_id', 'uuid', (column) =>
      column.notNull().references('dish.id').onDelete('no action'),
    )
    .addColumn('option_id', 'uuid', (column) =>
      column.notNull().references('option.id').onDelete('no action'),
    )
    .addColumn('customer_order_id', 'uuid', (column) =>
      column.notNull().references('customer_order.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('order_item_pkey', ['dish_id', 'option_id', 'customer_order_id'])
    .execute();

  await db.schema
    .createIndex('order_item_option_id_index')
    .on('order_item')
    .column('option_id')
    .execute();

  await db.schema
    .createIndex('order_item_customer_order_id_index')
    .on('order_item')
    .column('customer_order_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('order_item').execute();
}
