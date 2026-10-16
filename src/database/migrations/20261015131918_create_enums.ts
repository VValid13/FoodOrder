import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType('session_status')
    .asEnum(['draft', 'open', 'closed', 'ordered'])
    .execute();

  await db.schema
    .createType('invitation_status')
    .asEnum(['pending', 'accepted', 'declined', 'revoked'])
    .execute();

  await db.schema.createType('member_status').asEnum(['active', 'left']).execute();

  await db.schema
    .createType('order_status')
    .asEnum(['in_progress', 'validated', 'modified', 'cancelled'])
    .execute();

  await db.schema.createType('option_kind').asEnum(['size', 'extra', 'removal']).execute();

  await db.schema
    .createType('payment_method')
    .asEnum(['cash', 'card', 'transfer', 'other'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropType('payment_method').execute();
  await db.schema.dropType('option_kind').execute();
  await db.schema.dropType('order_status').execute();
  await db.schema.dropType('member_status').execute();
  await db.schema.dropType('invitation_status').execute();
  await db.schema.dropType('session_status').execute();
}
