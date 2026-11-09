import { Injectable } from '@nestjs/common';
import { type UUID } from 'crypto';
import { DeleteResult, InsertResult, Kysely, UpdateResult } from 'kysely';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { DatabaseTables } from '../database/database.types.js';
import { ContactEntity } from './contacts.entity.js';
import { UserEntity } from '../users/users.entity.js';

@Injectable()
export class ContactRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DatabaseTables>) {}

  async getAllOwnedGroups(id: UUID): Promise<ContactEntity[]> {
    return await this.db.selectFrom('userGroup').selectAll().where('ownerId', '=', id).execute();
  }

  async createEmptyGroup(groupInfo: ContactEntity): Promise<InsertResult> {
    return await this.db
      .insertInto('userGroup')
      .values({
        ...groupInfo,
      })
      .executeTakeFirstOrThrow();
  }

  async updateOwnedGroupLabel(
    userId: UUID,
    groupId: UUID,
    newLabel: string,
  ): Promise<UpdateResult> {
    return await this.db
      .updateTable('userGroup')
      .set({
        label: newLabel,
      })
      .where('id', '=', groupId)
      .where('ownerId', '=', userId)
      .executeTakeFirstOrThrow();
  }

  async addMember(groupId: UUID, newUserId: UUID): Promise<InsertResult> {
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
      .selectAll('user')
      .innerJoin('userGroupMember', 'userGroupMember.userId', 'user.id')
      .where('userGroupMember.userGroupId', '=', groupId)
      .execute();
  }

  async deleteGroupById(ownerId: UUID, groupId: UUID): Promise<DeleteResult> {
    return await this.db
      .deleteFrom('userGroup')
      .where('ownerId', '=', ownerId)
      .where('id', '=', groupId)
      .executeTakeFirstOrThrow();
  }

  async DeleteUserInGroup(groupId: UUID, toDeleteUserId: UUID): Promise<DeleteResult> {
    return await this.db
      .deleteFrom('userGroupMember')
      .where('userGroupId', '=', groupId)
      .where('userId', '=', toDeleteUserId)
      .executeTakeFirstOrThrow();
  }
}
