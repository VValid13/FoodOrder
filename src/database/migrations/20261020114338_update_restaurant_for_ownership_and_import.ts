import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('restaurant')
    .addColumn('owner_id', 'uuid', (column) =>
      column.notNull().references('user.id').onDelete('cascade'),
    )
    .addColumn('external_id', 'text')
    .execute();

  await db.schema
    .alterTable('restaurant')
    .alterColumn('menu_id', (column) => column.dropNotNull())
    .execute();

  await db.schema
    .alterTable('restaurant')
    .addUniqueConstraint('restaurant_owner_id_external_id_unique', ['owner_id', 'external_id'])
    .execute();

  await db.schema
    .createIndex('restaurant_owner_id_index')
    .on('restaurant')
    .column('owner_id')
    .execute();

  await db.schema
    .alterTable('opening_slot')
    .dropConstraint('opening_slot_day_of_week_check')
    .execute();

  await db.schema
    .alterTable('opening_slot')
    .addCheckConstraint('opening_slot_day_of_week_check', sql`day_of_week between 0 and 6`)
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('opening_slot')
    .dropConstraint('opening_slot_day_of_week_check')
    .execute();

  await db.schema
    .alterTable('opening_slot')
    .addCheckConstraint('opening_slot_day_of_week_check', sql`day_of_week between 1 and 7`)
    .execute();

  await db.schema.dropIndex('restaurant_owner_id_index').execute();

  await db.schema
    .alterTable('restaurant')
    .dropConstraint('restaurant_owner_id_external_id_unique')
    .execute();

  await db.schema
    .alterTable('restaurant')
    .alterColumn('menu_id', (column) => column.setNotNull())
    .execute();

  await db.schema
    .alterTable('restaurant')
    .dropColumn('external_id')
    .dropColumn('owner_id')
    .execute();
}
