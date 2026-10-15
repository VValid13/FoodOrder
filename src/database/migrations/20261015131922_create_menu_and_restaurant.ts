import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('menu')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('restaurant')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('menu_id', 'uuid', (column) =>
      column.notNull().references('menu.id').onDelete('no action'),
    )
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('address', 'text', (column) => column.notNull())
    .addColumn('phone', 'text')
    .addColumn('coordinates', 'text')
    .addColumn('timezone', 'text', (column) => column.notNull().defaultTo('Europe/Paris'))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('restaurant_menu_id_index')
    .on('restaurant')
    .column('menu_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('restaurant').execute();
  await db.schema.dropTable('menu').execute();
}
