import { Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from './contacts.repository.js';
import { UUID } from 'crypto';
import { ContactMapper } from './contacts.mapper.js';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';
import { UsersService } from '../users/users.service.js';
import { ContactsExceptions } from './_utils/exceptions/contacts.exceptions.js';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly contactMapper: ContactMapper,
    private readonly userService: UsersService,
    private readonly contactException: ContactsExceptions
  ) {}

  async getMyGroups(ownerId: UUID): Promise<MyGroupsResponseDto> {
    return this.contactMapper.toGroupsDto(await this.contactRepository.getAllOwnedGroups(ownerId));
  }

  async getUsersInGroupById(ownerId: UUID, groupId: UUID): Promise<GroupMembersResponseDto> {
    await this.isGroupOwnedOrThrow(ownerId, groupId);
    return this.contactMapper.toGroupMemberDto(
      groupId,
      await this.contactRepository.getGroupMembers(groupId),
    );
  }

  async addUserInGroup(ownerId: UUID, groupId: UUID, invitedUserId: UUID): Promise<void> {
    await this.isGroupOwnedOrThrow(ownerId, groupId);
    try {
      await this.userService.getUserById(invitedUserId);
    } catch {
      throw this.contactException.userNotFoundInGroup(invitedUserId);
    }
    await this.contactRepository.addMember(groupId, invitedUserId);
  }

  async deleteUser(ownerId: UUID, groupId: UUID, toDeleteUserId: UUID): Promise<void> {
    await this.isGroupOwnedOrThrow(ownerId, groupId);
    if (
      (await this.contactRepository.DeleteUserInGroup(groupId, toDeleteUserId)).numDeletedRows <= 0n
    ) {
      throw this.contactException.userNotFoundInGroup(toDeleteUserId);
    }
  }

  async createGroup(ownerId: UUID, label: string): Promise<MyGroupsResponseDto> {
    const newGroup = this.contactMapper.toNewGroup(ownerId, label);
    await this.contactRepository.createEmptyGroup(newGroup);
    return this.contactMapper.toGroupsDto([newGroup]);
  }

  async renameGroup(ownerId: UUID, groupId: UUID, newLabel: string): Promise<void> {
    if (
      (await this.contactRepository.updateOwnedGroupLabel(ownerId, groupId, newLabel))
        .numUpdatedRows <= 0n
    ) {
      throw this.contactException.groupNotFoundInOwnedGroups(groupId);
    }
  }

  async deletGroup(ownerId: UUID, groupId: UUID): Promise<void> {
    if ((await this.contactRepository.deleteGroupById(ownerId, groupId)).numDeletedRows <= 0n) {
      throw this.contactException.groupNotFoundInOwnedGroups(groupId);
    }
  }

  private async isGroupOwnedOrThrow(userId: UUID, groupId: UUID): Promise<void> {
    const myGroups = await this.contactRepository.getAllOwnedGroups(userId);
    if (myGroups.find((e) => e.id === groupId) === undefined) {
      throw this.contactException.groupNotFoundInOwnedGroups(userId);
    }
  }
}
