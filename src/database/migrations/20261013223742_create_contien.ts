import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('contien')
    .addColumn('plat_id', 'uuid', (column) =>
      column.notNull().references('plat.id').onDelete('no action'),
    )
    .addColumn('option_id', 'uuid', (column) =>
      column.notNull().references('option.id').onDelete('no action'),
    )
    .addColumn('commande_id', 'uuid', (column) =>
      column.notNull().references('commande.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('contien_pkey', ['plat_id', 'option_id', 'commande_id'])
    .execute();

  await db.schema
    .createIndex('contien_option_id_index')
    .on('contien')
    .column('option_id')
    .execute();

  await db.schema
    .createIndex('contien_commande_id_index')
    .on('contien')
    .column('commande_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('contien').execute();
}
