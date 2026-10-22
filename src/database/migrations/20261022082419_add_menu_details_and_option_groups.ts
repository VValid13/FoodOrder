import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable('dish')
    .addColumn('category', 'text', (column) => column.notNull())
    .addColumn('available', 'boolean', (column) => column.notNull().defaultTo(true))
    .addColumn('position', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('deleted_at', 'timestamptz')
    .execute();

  await db.schema
    .alterTable('dish')
    .addCheckConstraint('dish_position_check', sql`position >= 0`)
    .execute();

  await db.schema
    .createTable('option_group')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('dish_id', 'uuid', (column) =>
      column.notNull().references('dish.id').onDelete('cascade'),
    )
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('required', 'boolean', (column) => column.notNull().defaultTo(false))
    .addColumn('max_choices', 'integer', (column) => column.notNull().defaultTo(1))
    .addColumn('position', 'integer', (column) => column.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('option_group_max_choices_check', sql`max_choices >= 1`)
    .addCheckConstraint('option_group_position_check', sql`position >= 0`)
    .execute();

  await db.schema
    .createIndex('option_group_dish_id_index')
    .on('option_group')
    .column('dish_id')
    .execute();

  await db.schema.dropIndex('option_dish_id_index').execute();

  await db.schema
    .alterTable('option')
    .dropColumn('dish_id')
    .dropColumn('kind')
    .addColumn('option_group_id', 'uuid', (column) =>
      column.notNull().references('option_group.id').onDelete('cascade'),
    )
    .addColumn('position', 'integer', (column) => column.notNull().defaultTo(0))
    .execute();

  await db.schema
    .alterTable('option')
    .addCheckConstraint('option_position_check', sql`position >= 0`)
    .execute();

  await db.schema
    .createIndex('option_option_group_id_index')
    .on('option')
    .column('option_group_id')
    .execute();

  await db.schema.dropType('option_kind').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.createType('option_kind').asEnum(['size', 'extra', 'removal']).execute();

  await db.schema.dropIndex('option_option_group_id_index').execute();

  await db.schema.alterTable('option').dropConstraint('option_position_check').execute();

  await db.schema
    .alterTable('option')
    .dropColumn('position')
    .dropColumn('option_group_id')
    .addColumn('dish_id', 'uuid', (column) =>
      column.notNull().references('dish.id').onDelete('cascade'),
    )
    .addColumn('kind', sql`option_kind`, (column) => column.notNull())
    .execute();

  await db.schema.createIndex('option_dish_id_index').on('option').column('dish_id').execute();

  await db.schema.dropTable('option_group').execute();

  await db.schema.alterTable('dish').dropConstraint('dish_position_check').execute();

  await db.schema
    .alterTable('dish')
    .dropColumn('deleted_at')
    .dropColumn('position')
    .dropColumn('available')
    .dropColumn('category')
    .execute();
}
