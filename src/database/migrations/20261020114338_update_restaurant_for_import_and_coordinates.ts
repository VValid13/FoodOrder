import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('restaurant')
    .addColumn('external_id', 'text', (column) => column.unique())
    .addColumn('latitude', 'double precision')
    .addColumn('longitude', 'double precision')
    .dropColumn('coordinates')
    .execute();

  await db.schema
    .alterTable('restaurant')
    .alterColumn('menu_id', (column) => column.dropNotNull())
    .execute();

  await db.schema
    .alterTable('restaurant')
    .addCheckConstraint(
      'restaurant_coordinates_check',
      sql`(latitude is null) = (longitude is null)
        and (latitude is null or latitude between -90 and 90)
        and (longitude is null or longitude between -180 and 180)`,
    )
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
