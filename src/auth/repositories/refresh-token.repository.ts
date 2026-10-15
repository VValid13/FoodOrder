import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        token: hashedToken,
        expireAt: expireAt,
        idUser: userId,
        status: false,
      })
      .executeTakeFirst();
  }

  async revokeById(id: UUID): Promise<void> {
    await this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('idUser', '=', id)
      .executeTakeFirst();
  }

  async findValidByTokenHashAndRevoke(tokenHash: string): Promise<RefreshTokenSchema | null> {
    const validToken = await this.db
      .selectFrom('token')
      .selectAll()
      .where('token', '=', tokenHash)
      .where('status', '=', false)
      .executeTakeFirst();
    if (!validToken) throw new UnauthorizedException('Invalid Refresh token');
    await this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('id', '=', validToken.id)
      .executeTakeFirst();
    return validToken; // Token before update
  }

  async revokeByTokenHash(tokenHash: string) {
    await this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('token', '=', tokenHash)
      .executeTakeFirst();
  }

  async findValidById(id: UUID) {
    return await this.db
      .selectFrom('token')
      .selectAll()
      .where('id', '=', id)
      .where('status', '=', false)
      .executeTakeFirstOrThrow();
  }
}
