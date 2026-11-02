import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { Kysely } from 'kysely';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { DatabaseTables } from '../database/database.types.js';
import { ContactEntity } from './contacts.entity.js';

@Injectable()
export class ContactRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async findListByOwnerId(id: UUID): Promise<ContactEntity[]> {
    return await this.db
      .selectFrom('userGroup')
      .selectAll()
      .where('ownerId', '=', id)
      .execute();
  }

  async createEmptyGroup(groupInfo: ContactEntity) {
    return await this.db
      .insertInto('userGroup')
      .values({
        ...groupInfo,
      })
      .executeTakeFirstOrThrow();
  }
  /*
  async createList(userInfos: UserEntity) {
    return await this.db
      .insertInto('user')
      .values({
        ...userInfos,
      })
      .executeTakeFirstOrThrow();
  }
  */
}
