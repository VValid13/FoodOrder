import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DatabaseTables, Session, SessionStatus } from '../database/database.types.js';
import type { SessionTransition } from './_utils/types/session-transition.type.js';
import type { NewSessionValues, SessionChanges } from './_utils/types/session-values.type.js';

@Injectable()
export class SessionsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async createSession(values: NewSessionValues): Promise<Selectable<Session>> {
    return await this.db
      .insertInto('session')
      .values(values)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async findAllSessions(
    creatorId: UUID | undefined,
    status: SessionStatus | undefined,
  ): Promise<Selectable<Session>[]> {
    return await this.db
      .selectFrom('session')
      .selectAll()
      .$call((query) => (creatorId ? query.where('creatorId', '=', creatorId) : query))
      .$call((query) => (status ? query.where('status', '=', status) : query))
      .orderBy('deadlineAt', 'desc')
      .execute();
  }

  async updateSession(sessionId: UUID, changes: SessionChanges): Promise<Selectable<Session>> {
    return await this.db
      .updateTable('session')
      .set({ ...changes, updatedAt: new Date() })
      .where('id', '=', sessionId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async updateSessionStatus(
    sessionId: UUID,
    { from, to }: SessionTransition,
    changes: SessionChanges = {},
  ): Promise<Selectable<Session> | undefined> {
    return await this.db.transaction().execute(async (trx) => {
      const { status } = await trx
        .selectFrom('session')
        .select('status')
        .where('id', '=', sessionId)
        .forUpdate()
        .executeTakeFirstOrThrow();
      if (status !== from) {
        return undefined;
      }

      return await trx
        .updateTable('session')
        .set({ ...changes, status: to, updatedAt: new Date() })
        .where('id', '=', sessionId)
        .returningAll()
        .executeTakeFirstOrThrow();
    });
  }

  async hasActiveDish(restaurantId: UUID): Promise<boolean> {
    const dish = await this.db
      .selectFrom('dish')
      .innerJoin('restaurant', 'restaurant.menuId', 'dish.menuId')
      .select('dish.id')
      .where('restaurant.id', '=', restaurantId)
      .where('dish.deletedAt', 'is', null)
      .limit(1)
      .executeTakeFirst();
    return dish !== undefined;
  }
}
