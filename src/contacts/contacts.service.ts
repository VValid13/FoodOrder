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
  async getMyLists(ownerId: UUID) {
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

  async patchUsersInList() {}

  async createGroup(ownerId: UUID, label: string) {
    const newGroup = this.contactMapper.toNewGroup(ownerId, label);
    return await this.contactRepository.createEmptyGroup(newGroup);
  }

  async patchList() {}

  async delestList() {}
}
