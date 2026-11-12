import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('invitation').execute();
  await db.schema.dropType('invitation_status').execute();

  await db.schema
    .createType('participant_status')
    .asEnum(['invited', 'seen', 'in_progress', 'validated', 'modified', 'cancelled'])
    .execute();

  await db.schema.alterTable('session_member').dropColumn('status').execute();
  await db.schema.dropType('member_status').execute();

  await db.schema
    .alterTable('session_member')
    .alterColumn('user_id', (column) => column.dropNotNull())
    .addColumn('status', sql`participant_status`, (column) => column.notNull().defaultTo('invited'))
    .addColumn('name', 'text')
    .addColumn('token_hash', 'text', (column) => column.unique())
    .execute();

  await sql`update session_member set name = "user".username from "user" where "user".id = session_member.user_id`.execute(
    db,
  );

  await db.schema
    .alterTable('session_member')
    .alterColumn('name', (column) => column.setNotNull())
    .execute();

  await db.schema
    .createIndex('session_member_session_id_name_unique')
    .on('session_member')
    .unique()
    .expression(sql`session_id, lower(name)`)
    .execute();

  await db.schema
    .alterTable('session')
    .addColumn('public_link_enabled', 'boolean', (column) => column.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable('session').dropColumn('public_link_enabled').execute();

  await db.schema.dropIndex('session_member_session_id_name_unique').execute();

  await sql`delete from session_member where user_id is null`.execute(db);

  await db.schema
    .alterTable('session_member')
    .dropColumn('token_hash')
    .dropColumn('name')
    .dropColumn('status')
    .alterColumn('user_id', (column) => column.setNotNull())
    .execute();

  await db.schema.dropType('participant_status').execute();
  await db.schema.createType('member_status').asEnum(['active', 'left']).execute();

  await db.schema
    .alterTable('session_member')
    .addColumn('status', sql`member_status`, (column) => column.notNull().defaultTo('active'))
    .execute();

  await db.schema
    .createType('invitation_status')
    .asEnum(['pending', 'accepted', 'declined', 'revoked'])
    .execute();

  await db.schema
    .createTable('invitation')
    .addColumn('id', 'uuid', (column) => column.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('session_id', 'uuid', (column) =>
      column.notNull().references('session.id').onDelete('cascade'),
    )
    .addColumn('recipient_id', 'uuid', (column) => column.references('user.id').onDelete('cascade'))
    .addColumn('token_hash', 'text', (column) => column.notNull().unique())
    .addColumn('status', sql`invitation_status`, (column) => column.notNull().defaultTo('pending'))
    .addColumn('expires_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createIndex('invitation_session_id_index')
    .on('invitation')
    .column('session_id')
    .execute();

  await db.schema
    .createIndex('invitation_recipient_id_index')
    .on('invitation')
    .column('recipient_id')
    .execute();
}
