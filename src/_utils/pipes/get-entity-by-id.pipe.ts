import { Injectable, NotFoundException } from '@nestjs/common';
import type { PipeTransform, Type } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../../database/database.types.js';
import { NOT_FOUND_MESSAGE_SUFFIX } from '../constants/get-entity-by-id.constants.js';
import { InjectKysely } from '../decorators/inject-kysely.decorator.js';
import { UUIDFormatException } from '../global.exception.js';
import { isUuid } from '../helpers/is-uuid.helper.js';
import type { GetEntityByIdOptions, TableRow, TableWithId } from '../types/table-row.type.js';

export function getEntityByIdPipe<TTable extends TableWithId>(
  table: TTable,
  options?: GetEntityByIdOptions,
): Type<PipeTransform<string, Promise<TableRow<TTable>>>> {
  @Injectable()
  class GetEntityByIdPipe implements PipeTransform<string, Promise<TableRow<TTable>>> {
    constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

    async transform(value: string): Promise<TableRow<TTable>> {
      if (!isUuid(value)) {
        throw UUIDFormatException;
      }

      const entity = await this.db
        .selectFrom(this.db.dynamic.table(table).as('entity'))
        .selectAll()
        .where(this.db.dynamic.ref('entity.id'), '=', value)
        .$castTo<TableRow<TTable>>()
        .executeTakeFirst();

      if (!entity) {
        throw new NotFoundException(
          options?.notFoundMessage ?? `${table.toUpperCase()}${NOT_FOUND_MESSAGE_SUFFIX}`,
        );
      }

      return entity;
    }
  }

  return GetEntityByIdPipe;
}
