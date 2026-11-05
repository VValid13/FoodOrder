import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import type { DatabaseTables } from '../../database/database.types.js';

export type TableWithId = {
  [TTable in keyof DatabaseTables]: DatabaseTables[TTable] extends { id: unknown } ? TTable : never;
}[keyof DatabaseTables];

export type TableRow<TTable extends TableWithId> = Selectable<DatabaseTables[TTable]>;

export type UuidColumn<TTable extends TableWithId> = {
  [TColumn in keyof TableRow<TTable>]: TableRow<TTable>[TColumn] extends UUID ? TColumn : never;
}[keyof TableRow<TTable>];

export type GetEntityByIdOptions<TTable extends TableWithId> = {
  notFoundMessage?: string;
  ownerProperty?: UuidColumn<TTable>;
};
