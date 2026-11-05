import { sql } from 'kysely';
import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType('payment_mode')
    .asEnum(['each_pays', 'equal_split', 'payer_offers'])
    .execute();

  await db.schema.dropIndex('session_status_time_limit_index').execute();

  await db.schema.alterTable('session').renameColumn('time_limit', 'deadline_at').execute();
  await db.schema.alterTable('session').renameColumn('approx_delivery_time', 'pickup_at').execute();

  await db.schema
    .alterTable('session')
    .alterColumn('pickup_at', (column) => column.setNotNull())
    .addColumn('label', 'text', (column) => column.notNull())
    .addColumn('payment_mode', sql`payment_mode`, (column) =>
      column.notNull().defaultTo('each_pays'),
    )
    .addColumn('payer_name', 'text')
    .addColumn('fees', 'real', (column) => column.notNull().defaultTo(0))
    .addColumn('discount', 'real', (column) => column.notNull().defaultTo(0))
    .addColumn('free_mode', 'boolean', (column) => column.notNull().defaultTo(false))
    .addColumn('share_token', 'text', (column) => column.notNull().unique())
    .addColumn('expires_at', 'timestamptz', (column) => column.notNull())
    .execute();

  await db.schema
    .alterTable('session')
    .addCheckConstraint('session_pickup_after_deadline_check', sql`pickup_at > deadline_at`)
    .execute();

  await db.schema
    .alterTable('session')
    .addCheckConstraint('session_fees_check', sql`fees >= 0`)
    .execute();

  await db.schema
    .alterTable('session')
    .addCheckConstraint('session_discount_check', sql`discount >= 0`)
    .execute();

  await db.schema
    .createIndex('session_status_deadline_at_index')
    .on('session')
    .columns(['status', 'deadline_at'])
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropIndex('session_status_deadline_at_index').execute();

  await db.schema.alterTable('session').dropConstraint('session_discount_check').execute();
  await db.schema.alterTable('session').dropConstraint('session_fees_check').execute();
  await db.schema
    .alterTable('session')
    .dropConstraint('session_pickup_after_deadline_check')
    .execute();

  await db.schema
    .alterTable('session')
    .dropColumn('expires_at')
    .dropColumn('share_token')
    .dropColumn('free_mode')
    .dropColumn('discount')
    .dropColumn('fees')
    .dropColumn('payer_name')
    .dropColumn('payment_mode')
    .dropColumn('label')
    .alterColumn('pickup_at', (column) => column.dropNotNull())
    .execute();

  await db.schema.alterTable('session').renameColumn('pickup_at', 'approx_delivery_time').execute();
  await db.schema.alterTable('session').renameColumn('deadline_at', 'time_limit').execute();

  await db.schema
    .createIndex('session_status_time_limit_index')
    .on('session')
    .columns(['status', 'time_limit'])
    .execute();

  await db.schema.dropType('payment_mode').execute();
}
