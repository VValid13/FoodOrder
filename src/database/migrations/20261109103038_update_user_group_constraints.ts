import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('user_group')
    .addUniqueConstraint('unique_label_by_owner', ['owner_id', 'label'])
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

  await db.schema.alterTable('restaurant').dropConstraint('restaurant_coordinates_check').execute();

  await db.schema
    .alterTable('restaurant')
    .alterColumn('menu_id', (column) => column.setNotNull())
    .execute();

  await db.schema
    .alterTable('restaurant')
    .addColumn('coordinates', 'text')
    .dropColumn('longitude')
    .dropColumn('latitude')
    .dropColumn('external_id')
    .execute();
}
