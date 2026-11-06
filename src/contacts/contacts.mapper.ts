import { Injectable } from '@nestjs/common';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { type UUID } from 'crypto';
import { UserEntity } from '../users/users.entity.js';
import { ContactEntity } from './contacts.entity.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';

@Injectable()
export class ContactMapper {
  constructor() {}

  toGroupMemberDto = (members: UserEntity[]): GroupMembersResponseDto => {
    return { users: members.map((e: UserEntity) => ({ id: e.id, username: e.username })) }; //this.userMapper.toGetUserDto(e)) };
  };

  toGroupsDto = (entityGroups: ContactEntity[]): MyGroupsResponseDto => {
    return {
      groups: entityGroups.map((e: ContactEntity) => ({ groupId: e.id, groupLabel: e.label })),
    };
  };

  toNewGroup = (id: UUID, label: string) => {
    return {
      id: crypto.randomUUID(),
      ownerId: id,
      label: label,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };
}
