import { Injectable } from '@nestjs/common';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../database/database.types.js';
import { UUID } from 'crypto';
import { UserEntity } from './users.entity.js';

@Injectable()
export class UsersRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async findById(id: UUID): Promise<UserEntity | undefined> {
      return await this.db.selectFrom('user').selectAll().where('id', '=', id).executeTakeFirst();
    }

  async createUser(userInfos: UserEntity) {
    return this.db
      .insertInto('user')
      .values({
        ...userInfos,
      })
      .executeTakeFirstOrThrow();
  }

  async findOneByUsername(formatedUsername: string): Promise<UserEntity> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .where('username', '=', formatedUsername)
      .executeTakeFirstOrThrow();
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
