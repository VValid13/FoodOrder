import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('documents')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('url', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('resto_documents')
    .addColumn('resto_id', 'uuid', (column) =>
      column.notNull().references('resto.id').onDelete('cascade'),
    )
    .addColumn('documents_id', 'uuid', (column) =>
      column.notNull().references('documents.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('resto_documents_pkey', ['resto_id', 'documents_id'])
    .execute();

  await db.schema
    .createIndex('resto_documents_documents_id_index')
    .on('resto_documents')
    .column('documents_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('resto_documents').execute();
  await db.schema.dropTable('documents').execute();
}
