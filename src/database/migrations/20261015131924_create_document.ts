import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('document')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('key', 'text', (column) => column.notNull().unique())
    .addColumn('mime_type', 'text', (column) => column.notNull())
    .addColumn('byte_size', 'integer', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addCheckConstraint('document_byte_size_check', sql`byte_size > 0`)
    .execute();

  await db.schema
    .createTable('restaurant_document')
    .addColumn('restaurant_id', 'uuid', (column) =>
      column.notNull().references('restaurant.id').onDelete('cascade'),
    )
    .addColumn('document_id', 'uuid', (column) =>
      column.notNull().references('document.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('restaurant_document_pkey', ['restaurant_id', 'document_id'])
    .execute();

  await db.schema
    .createIndex('restaurant_document_document_id_index')
    .on('restaurant_document')
    .column('document_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('restaurant_document').execute();
  await db.schema.dropTable('document').execute();
}
