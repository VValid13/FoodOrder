import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { Selectable } from 'kysely';
import type { UUID } from 'node:crypto';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DatabaseTables, Session, SessionStatus } from '../database/database.types.js';
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
    creatorId: UUID,
    status: SessionStatus | undefined,
  ): Promise<Selectable<Session>[]> {
    return await this.db
      .selectFrom('session')
      .selectAll()
      .where('creatorId', '=', creatorId)
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
}
