import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType('session_status')
    .asEnum(['draft', 'open', 'closed', 'ordered'])
    .execute();

  await db.schema
    .createType('commande_status')
    .asEnum(['in_progress', 'validated', 'modified', 'cancelled'])
    .execute();

  await db.schema
    .createType('join_status')
    .asEnum(['invited', 'seen', 'in_progress', 'validated', 'modified', 'cancelled'])
    .execute();

  await db.schema
    .createType('payback_method')
    .asEnum(['cash', 'card', 'transfer', 'other'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropType('payback_method').execute();
  await db.schema.dropType('join_status').execute();
  await db.schema.dropType('commande_status').execute();
  await db.schema.dropType('session_status').execute();
}
