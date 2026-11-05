import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contacts.repository.js';
import { UUID } from 'crypto';
import { UserMapper } from '../users/users.mapper.js';
import { UsersService } from '../users/users.service.js';
import { ContactMapper } from './contacts.mapper.js';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';

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

  async getUsersInGroupByLabel(
    ownerId: UUID,
    groupLabel: string,
  ): Promise<GroupMembersResponseDto> {
    return this.contactMapper.toGroupMemberDto(
      await this.contactRepository.getGroupMembers(
        await this.contactMapper.toGroupId(ownerId, groupLabel),
      ),
    );
  }

  async addUserInGroup(ownerId: UUID, groupLabel: string, invitedUsername: string) {
    const invitedUser = await this.userService.getUserByUsername(
      this.userMapper.formatUsername(invitedUsername),
    );
    return await this.contactRepository.addMember(
      await this.contactMapper.toGroupId(ownerId, groupLabel),
      invitedUser.id,
    );
  }

  // async deleteUserFromGroup(ownerId: UUID, groupLabel: string, toDeleteUsername: string) {
  //   const toRemoveUser = await this.userService.getUserByUsername(
  //     this.userMapper.formatUsername(toDeleteUsername),
  //   );
  //   return await this.contactRepository.DeleteUserInGroup(
  //     await this.contactMapper.toGroupId(ownerId, groupLabel),
  //     toRemoveUser.id,
  //   );
  // }
  async deleteUser(ownerId: UUID, groupId: UUID, toDeleteUserId: UUID) {
    return await this.contactRepository.DeleteUserInGroup(
      groupId,
      toDeleteUserId,
    );
  }

  async createGroup(ownerId: UUID, label: string) {
    const newGroup = this.contactMapper.toNewGroup(ownerId, label);
    return await this.contactRepository.createEmptyGroup(newGroup);
  }

  async renameGroup(ownerId: UUID, oldLabel: string, newLabel: string) {
    await this.contactRepository.updateGroupLabel(ownerId, oldLabel, newLabel);
  }

  async deletGroup(ownerId: UUID, groupLabel: string) {
    return await this.contactRepository.deleteGroupByLabel(ownerId, groupLabel);
  }
}
