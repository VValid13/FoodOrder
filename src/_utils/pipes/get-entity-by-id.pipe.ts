import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import type { PipeTransform, Type } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../../database/database.types.js';
import { NOT_FOUND_MESSAGE_SUFFIX } from '../constants/get-entity-by-id.constants.js';
import { InjectKysely } from '../decorators/inject-kysely.decorator.js';
import type { UserEntity } from '../../users/users.entity.js';
import { ForbiddenActionException, UUIDFormatException } from '../global.exception.js';
import { isUuid } from '../helpers/is-uuid.helper.js';
import type { GetEntityByIdOptions, TableRow, TableWithId } from '../types/table-row.type.js';

export function getEntityByIdPipe<TTable extends TableWithId>(
  table: TTable,
  options?: GetEntityByIdOptions<TTable>,
): Type<PipeTransform<string, Promise<TableRow<TTable>>>> {
  @Injectable({ scope: Scope.REQUEST })
  class GetEntityByIdPipe implements PipeTransform<string, Promise<TableRow<TTable>>> {
    constructor(
      @InjectKysely() private readonly db: Kysely<DatabaseTables>,
      @Inject(REQUEST) private readonly request: Request & { user: UserEntity },
    ) {}

    async transform(value: string): Promise<TableRow<TTable>> {
      if (!isUuid(value)) {
        throw UUIDFormatException;
      }

      const entity: TableRow<TTable> | undefined = await this.db
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

      if (options?.ownerProperty && entity[options.ownerProperty] !== this.request.user.id) {
        throw ForbiddenActionException;
      }

      return entity;
    }
  }

  return GetEntityByIdPipe;
}
