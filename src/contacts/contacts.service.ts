import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contacts.repository.js';
import { UUID } from 'crypto';
import { UserMapper } from '../users/users.mapper.js';
import { UsersService } from '../users/users.service.js';
import { KyselyError } from '../_utils/kysely.error.js';
import { ContactMapper } from './contacts.mapper.js';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly contactMapper: ContactMapper,
    private readonly userService: UsersService,
    private readonly userMapper: UserMapper,
  ) {}
  async getMyGroups(ownerId: UUID) {
    return await this.contactRepository.findListByOwnerId(ownerId);
  }

  async getUsersInGroupByLabel(ownerId: UUID, groupLabel: string) {
    const ownedGroups = await this.contactRepository.findListByOwnerId(ownerId);
    const group = ownedGroups.find((c) => c.label === groupLabel);
    if (!group) {
      throw new KyselyError('404', 'label not found in owned groups');
    }
    return this.contactMapper.toGroupMemberDto(
      await this.contactRepository.getGroupMembers(group.id),
    );
  }

  async addUserInGroupByLabel(ownerId: UUID, groupLabel: string, invitedUsername: string) {
    const ownedGroups = await this.contactRepository.findListByOwnerId(ownerId);
    const group = ownedGroups.find((c) => c.label === groupLabel);
    const invitedUser = await this.userService.getUserByUsername(
      this.userMapper.formatUsername(invitedUsername),
    );
    if (!group) {
      throw new KyselyError('404', 'label not found in owned groups');
    }
    return await this.contactRepository.addMember(group.id, invitedUser.id);
  }

  async addUserInGroup(ownerId: UUID, groupId: UUID, invitedUsername: string) {
    const ownedGroups = await this.contactRepository.findListByOwnerId(ownerId);
    if (!ownedGroups.some((c) => c.ownerId === ownerId)) {
      throw new KyselyError('403', 'group not owned');
    }
    return await this.contactRepository.addMember(
      groupId,
      {
        ...(await this.userService.getUserByUsername(
          this.userMapper.formatUsername(invitedUsername),
        )),
      }.id,
    );
  }

  async deleteUserFromGroup(ownerId: UUID, groupLabel: string, toDeleteUsername: string) {
    const ownedGroups = await this.contactRepository.findListByOwnerId(ownerId);
    const group = ownedGroups.find((c) => c.label === groupLabel);
    const toRemoveUser = await this.userService.getUserByUsername(
      this.userMapper.formatUsername(toDeleteUsername),
    );
    if (!group) {
      throw new KyselyError('404', 'label not found in owned groups');
    }
    return await this.contactRepository.DeleteUserInGroup(group.id, toRemoveUser.id);
  }

  async createGroup(ownerId: UUID, label: string) {
    const newGroup = this.contactMapper.toNewGroup(ownerId, label);
    return await this.contactRepository.createEmptyGroup(newGroup);
  }

  async renameGroup(ownerId: UUID, oldLabel: string, newLabel: string) {
    return await this.contactRepository.updateGroupLabel(ownerId, oldLabel, newLabel);
  }

  async delestGroup(ownerId: UUID, groupLabel: string) {
    return await this.contactRepository.deleteGroupByLabel(ownerId, groupLabel);
  }
}
