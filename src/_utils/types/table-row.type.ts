import type { Selectable } from 'kysely';
import type { DatabaseTables } from '../../database/database.types.js';

export type TableWithId = {
  [TTable in keyof DatabaseTables]: DatabaseTables[TTable] extends { id: unknown } ? TTable : never;
}[keyof DatabaseTables];

export type TableRow<TTable extends TableWithId> = Selectable<DatabaseTables[TTable]>;

export type GetEntityByIdOptions = {
  notFoundMessage?: string;
};
