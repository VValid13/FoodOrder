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
    .alterTable('user_group')
    .dropConstraint('unique_label_by_owner')
    .execute();
}
