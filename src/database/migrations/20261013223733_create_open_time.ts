import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('open_time')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('opening_time', 'timestamptz', (column) => column.notNull())
    .addColumn('closing_time', 'timestamptz', (column) => column.notNull())
    .addColumn('label', 'text')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('open_time_closing_after_opening_check', sql`closing_time > opening_time`)
    .execute();

  await db.schema
    .createTable('open_planning')
    .addColumn('resto_id', 'uuid', (column) =>
      column.notNull().references('resto.id').onDelete('cascade'),
    )
    .addColumn('open_time_id', 'uuid', (column) =>
      column.notNull().references('open_time.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('open_planning_pkey', ['resto_id', 'open_time_id'])
    .execute();

  await db.schema
    .createIndex('open_planning_open_time_id_index')
    .on('open_planning')
    .column('open_time_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('open_planning').execute();
  await db.schema.dropTable('open_time').execute();
}
