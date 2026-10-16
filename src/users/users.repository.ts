import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../database/database.types.js';
import { UUID } from 'crypto';
import { UserSchema } from './users.schema.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectKysely() private readonly db: Kysely<DatabaseTables>,
  ) {}

  async findById(id: UUID): Promise<UserSchema> {
    const result = await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (!result) {
      throw new NotFoundException('unknown id');
    }
    return result;
  }

  async createUser(userInfos: UserSchema) {

    return this.db
      .insertInto('user')
      .values({
        id: userInfos.id,
        username: userInfos.username,
        passwordHash: userInfos.passwordHash,
      })
      .executeTakeFirst();
  }

  async findOneByUsername(username: string): Promise<UserSchema | undefined> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async updatePasswordById(id: UUID, new_password: string) {
    return await this.db
      .updateTable('user')
      .set({
        passwordHash: new_password,
      })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
