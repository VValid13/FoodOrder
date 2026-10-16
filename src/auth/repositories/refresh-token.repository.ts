import { Injectable } from '@nestjs/common';
import { InjectKysely } from '../../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../../database/database.types.js';
import { UUID } from 'crypto';
import { RefreshTokenSchema } from '../schemas/refresh-token.schema.js';

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
      .executeTakeFirst();
  }

  async revokeByUserId(id: UUID): Promise<void> {
    await this.db
      .updateTable('token')
      .set({
        isActive: false,
      })
      .where('userId', '=', id)
      .executeTakeFirst();
  }

  async findIdByValidTokenHash(tokenHash: string): Promise<RefreshTokenSchema | undefined> {
    return await this.db
      .selectFrom('token')
      .selectAll()
      .where('tokenHash', '=', tokenHash)
      .where('isActive', '=', true)
      .executeTakeFirst();
  }

  async revokeByTokenHash(tokenHash: string) {
    await this.db
      .updateTable('token')
      .set({
        isActive: false,
      })
      .where('tokenHash', '=', tokenHash)
      .executeTakeFirst();
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
