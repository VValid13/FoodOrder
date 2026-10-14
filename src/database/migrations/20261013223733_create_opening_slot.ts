import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('opening_slot')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('opens_at', 'timestamptz', (column) => column.notNull())
    .addColumn('closes_at', 'timestamptz', (column) => column.notNull())
    .addColumn('label', 'text')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('opening_slot_closes_after_opens_check', sql`closes_at > opens_at`)
    .execute();

  await db.schema
    .createTable('restaurant_opening_slot')
    .addColumn('restaurant_id', 'uuid', (column) =>
      column.notNull().references('restaurant.id').onDelete('cascade'),
    )
    .addColumn('opening_slot_id', 'uuid', (column) =>
      column.notNull().references('opening_slot.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('restaurant_opening_slot_pkey', ['restaurant_id', 'opening_slot_id'])
    .execute();

  await db.schema
    .createIndex('restaurant_opening_slot_opening_slot_id_index')
    .on('restaurant_opening_slot')
    .column('opening_slot_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('restaurant_opening_slot').execute();
  await db.schema.dropTable('opening_slot').execute();
}
