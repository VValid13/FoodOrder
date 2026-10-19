import { Injectable } from '@nestjs/common';
import { InjectKysely } from '../../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../../database/database.types.js';
import { UUID } from 'crypto';
import { RefreshTokenEntity } from '../entity/refresh-token.entity.js';

@Injectable()
export class RefreshTokenRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async create(userId: UUID, hashedToken: string, expireAt: Date): Promise<void> {
    await this.db
      .insertInto('token')
      .values({
        id: crypto.randomUUID(),
        tokenHash: hashedToken,
        expireAt,
        userId: userId,
        isActive: true,
        createdAt: new Date(),
      })
      .executeTakeFirstOrThrow();
  }

  async revokeByUserId(id: UUID): Promise<void> {
    await this.db
      .updateTable('token')
      .set({
        isActive: false,
      })
      .where('userId', '=', id)
      .executeTakeFirstOrThrow();
  }

  async findIdByValidTokenHash(tokenHash: string): Promise<RefreshTokenEntity | undefined> {
    return await this.db
      .selectFrom('token')
      .selectAll()
      .where('tokenHash', '=', tokenHash)
      .where('isActive', '=', true)
      .executeTakeFirstOrThrow();
  }

  async revokeByTokenHash(tokenHash: string) {
    await this.db
      .updateTable('token')
      .set({
        isActive: false,
      })
      .where('tokenHash', '=', tokenHash)
      .executeTakeFirstOrThrow();
  }

  async findValidById(id: UUID) {
    return await this.db
      .selectFrom('token')
      .selectAll()
      .where('id', '=', id)
      .where('isActive', '=', true)
      .executeTakeFirstOrThrow();
  }
}
