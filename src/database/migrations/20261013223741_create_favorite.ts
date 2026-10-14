import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('favorite')
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('customer_order_id', 'uuid', (column) =>
      column.notNull().references('customer_order.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('favorite_pkey', ['user_id', 'customer_order_id'])
    .execute();

  await db.schema
    .createIndex('favorite_customer_order_id_index')
    .on('favorite')
    .column('customer_order_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('favorite').execute();
}
