import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('plat')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('resto_id', 'uuid', (column) =>
      column.notNull().references('resto.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('price_cents', 'integer', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('plat_price_cents_check', sql`price_cents >= 0`)
    .execute();

  await db.schema.createIndex('plat_resto_id_index').on('plat').column('resto_id').execute();

  await db.schema
    .createTable('option')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('plat_id', 'uuid', (column) =>
      column.notNull().references('plat.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('price_cents', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('option_price_cents_check', sql`price_cents >= 0`)
    .execute();

  await db.schema.createIndex('option_plat_id_index').on('option').column('plat_id').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('option').execute();
  await db.schema.dropTable('plat').execute();
}
