import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('dish')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('restaurant_id', 'uuid', (column) =>
      column.notNull().references('restaurant.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('price_cents', 'integer', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('dish_price_cents_check', sql`price_cents >= 0`)
    .execute();

  await db.schema
    .createIndex('dish_restaurant_id_index')
    .on('dish')
    .column('restaurant_id')
    .execute();

  await db.schema
    .createTable('option')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('dish_id', 'uuid', (column) =>
      column.notNull().references('dish.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('price_cents', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('option_price_cents_check', sql`price_cents >= 0`)
    .execute();

  await db.schema.createIndex('option_dish_id_index').on('option').column('dish_id').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('option').execute();
  await db.schema.dropTable('dish').execute();
}
