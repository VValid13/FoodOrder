import { Injectable } from '@nestjs/common';
import { type UUID } from 'crypto';
import { Kysely } from 'kysely';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { DatabaseTables } from '../database/database.types.js';
import { ContactEntity } from './contacts.entity.js';
import { UserEntity } from '../users/users.entity.js';

@Injectable()
export class ContactRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async findListByOwnerId(id: UUID): Promise<ContactEntity[]> {
    return await this.db.selectFrom('userGroup').selectAll().where('ownerId', '=', id).execute();
  }

  async createEmptyGroup(groupInfo: ContactEntity) {
    return await this.db
      .insertInto('userGroup')
      .values({
        ...groupInfo,
      })
      .executeTakeFirstOrThrow();
  }

  async updateGroupLabel(userId: UUID, oldLabel: string, newLabel: string) {
    return await this.db
      .updateTable('userGroup')
      .set({
        label: newLabel,
      })
      .where('label', '=', oldLabel)
      .where('ownerId', '=', userId)
      .executeTakeFirstOrThrow();
  }

  async addMember(groupId: UUID, newUserId: UUID) {
    return await this.db
      .insertInto('userGroupMember')
      .values({
        createdAt: new Date(),
        userGroupId: groupId,
        userId: newUserId,
      })
      .executeTakeFirstOrThrow();
  }

  async getGroupMembers(groupId: UUID): Promise<UserEntity[]> {
    return await this.db
      .selectFrom('user')
      .selectAll()
      .innerJoin('userGroupMember', 'userGroupMember.userId', 'user.id')
      .where('userGroupMember.userGroupId', '=', groupId)
      .execute();
  }

  async deleteGroupByLabel(ownerId: UUID, groupLabel: string) {
    return await this.db
      .deleteFrom('userGroup')
      .where('ownerId', '=', ownerId)
      .where('label', '=', groupLabel)
      .executeTakeFirstOrThrow();
  }

  async DeleteUserInGroup(groupId: UUID, toDeleteUserId: UUID) {
    return await this.db
      .deleteFrom('userGroupMember')
      .where('userGroupId', '=', groupId)
      .where('userId', '=', toDeleteUserId)
      .executeTakeFirstOrThrow();
  }
}
