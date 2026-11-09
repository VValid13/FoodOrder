import { Injectable } from '@nestjs/common';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import type { UUID } from 'crypto';
import { UserEntity } from '../users/users.entity.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';
import { ContactGroup } from './_utils/types/contact-group.type.js';

@Injectable()
export class ContactMapper {
  toGroupMemberDto = (groupId: UUID, members: UserEntity[]): GroupMembersResponseDto => {
    return {
      groupId: groupId,
      users: members.map((e: UserEntity) => ({ id: e.id, username: e.username })),
    };
  };

  toGroupsDto = (entityGroups: ContactGroup[]): MyGroupsResponseDto => {
    return {
      groups: entityGroups.map((e: ContactGroup) => ({ groupId: e.id, groupLabel: e.label })),
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
