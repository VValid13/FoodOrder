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
    const result = await this.db
      .insertInto('token')
      .values({
        //id: crypto.randomUUID(),
        token: hashedToken,
        expireAt: expireAt,
        id_user: userId,
        status: false,
      })
      .executeTakeFirst();
    console.log(result);
  }

  async revokeById(id: UUID): Promise<void> {
    const result = await this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('id_user', '=', id)
      .executeTakeFirst();
    console.log(result);
  }

  async findValidByTokenHashAndRevoke(tokenHash: string): Promise<RefreshTokenSchema | null> {
    const validToken = await this.db
      .selectFrom('token')
      .selectAll()
      .where('token', '=', tokenHash)
      .where('status', '=', false)
      .executeTakeFirstOrThrow();
    const result = await this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('id', '=', validToken.id)
      .executeTakeFirst();
    console.log(result);
    return validToken; // Token before update
  }

  async revokeByTokenHash(tokenHash: string) {
    const result = this.db
      .updateTable('token')
      .set({
        status: true,
      })
      .where('token', '=', tokenHash)
      .executeTakeFirst();
    console.log(result);
  }

  async findValidById(id: UUID) {
    const validToken = await this.db
      .selectFrom('token')
      .selectAll()
      .where('id', '=', id)
      .where('status', '=', false)
      .executeTakeFirstOrThrow();
    console.log(validToken);
    return validToken;
  }
}
