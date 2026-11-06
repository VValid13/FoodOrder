import { Catch, Injectable, NotFoundException } from '@nestjs/common';
import { ContactRepository } from './contacts.repository.js';
import { UUID } from 'crypto';
import { ContactMapper } from './contacts.mapper.js';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';
import { DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly contactMapper: ContactMapper,
    private readonly userService: UsersService
  ) {}

  async getMyGroups(ownerId: UUID): Promise<MyGroupsResponseDto> {
    return this.contactMapper.toGroupsDto(
      await this.contactRepository.getAllOwnedGroups(ownerId)
    );
  }

  async getUsersInGroupById(
    ownerId: UUID,
    groupId: UUID,
  ): Promise<GroupMembersResponseDto> {
    await this.isGroupOwnedOrThrow(ownerId, groupId)
    return this.contactMapper.toGroupMemberDto(
      await this.contactRepository.getGroupMembers(
        groupId
      ),
    );
  }

  async addUserInGroup(ownerId: UUID, groupId: UUID, invitedUserId: UUID): Promise<InsertResult> {
    await this.isGroupOwnedOrThrow(ownerId, groupId)
    try{
      await this.userService.getUserById(invitedUserId)
    }catch(e: any){
      console.log(e.message);
      throw new NotFoundException('invited user not found');
    }
    return await this.contactRepository.addMember(
      groupId,
      invitedUserId,
    );
  }

  async deleteUser(ownerId: UUID, groupId: UUID, toDeleteUserId: UUID): Promise<DeleteResult> {
    await this.isGroupOwnedOrThrow(ownerId, groupId)
    return await this.contactRepository.DeleteUserInGroup(
      groupId,
      toDeleteUserId,
    );
  }

  async createGroup(ownerId: UUID, label: string): Promise<MyGroupsResponseDto> {
    const newGroup = this.contactMapper.toNewGroup(ownerId, label);
    await this.contactRepository.createEmptyGroup(newGroup);
    return this.contactMapper.toGroupsDto([newGroup]);
  }

  async renameGroup(ownerId: UUID, groupId: UUID, newLabel: string): Promise<UpdateResult> {
    return await this.contactRepository.updateOwnedGroupLabel(ownerId, groupId, newLabel);
  }

  async deletGroup(ownerId: UUID, groupId: UUID): Promise<DeleteResult> {
    return await this.contactRepository.deleteGroupById(ownerId, groupId);
  }

  //TODO MOVE TU UTILS
 private async isGroupOwnedOrThrow(userId:UUID, groupId: UUID): Promise<void> {
  const myGroups = await this.contactRepository.getAllOwnedGroups(userId)
  if(myGroups.find(e => e.id === groupId) === undefined){
    throw new NotFoundException('id not found in owned groups');
  };
 }
}