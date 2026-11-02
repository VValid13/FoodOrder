import { Injectable } from '@nestjs/common';
import { randomUUID, UUID } from 'crypto';
import { Kysely } from 'kysely';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { DatabaseTables, User } from '../database/database.types.js';
import { ContactEntity } from './contacts.entity.js';
import { group } from 'console';

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

  async addMember(groupId: UUID, newUserId: UUID){
    return await this.db
    .insertInto('userGroupMember')
    .values({
        createdAt: new Date(),
        userGroupId: groupId,
        userId: newUserId,
    })
    .executeTakeFirstOrThrow()
  }

  async getGroupMembers(ownerId: UUID,groupId: UUID){
    return await this.db
    .selectFrom('user')
    .selectAll()
    .innerJoin('userGroup', 'userGroup.id', 'user.id')
    .where('userGroup.id', '=', groupId)
    .execute()
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
