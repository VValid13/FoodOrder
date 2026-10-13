import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('session_join')
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (column) =>
      column.notNull().references('app_user.id').onDelete('cascade'),
    )
    .addColumn('commande_id', 'uuid', (column) =>
      column.notNull().references('commande.id').onDelete('cascade'),
    )
    .addColumn('payback_method', sql`payback_method`)
    .addColumn('paid_back', 'boolean', (column) => column.notNull().defaultTo(false))
    .addColumn('status', sql`join_status`, (column) => column.notNull().defaultTo('invited'))
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addPrimaryKeyConstraint('session_join_pkey', ['session_id', 'user_id', 'commande_id'])
    .execute();

  await db.schema
    .createIndex('session_join_user_id_index')
    .on('session_join')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('session_join_commande_id_index')
    .on('session_join')
    .column('commande_id')
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('session_join').execute();
}
