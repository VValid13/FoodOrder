import { Injectable } from '@nestjs/common';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { type UUID } from 'crypto';
import { UserEntity } from '../users/users.entity.js';
import { UserMapper } from '../users/users.mapper.js';
import { ContactRepository } from './contacts.repository.js';
import { KyselyError } from '../_utils/kysely.error.js';

@Injectable()
export class ContactMapper {
  constructor(
    private readonly contactRepository: ContactRepository,
    private readonly userMapper: UserMapper,
  ) {}

  toGroupMemberDto = (members: UserEntity[]): GroupMembersResponseDto => {
    return { users: members.map((e: UserEntity) => this.userMapper.toGetUserDto(e)) };
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

  toGroupId = async (ownerId: UUID, groupLabel: string): Promise<UUID> => {
    const ownedGroups = await this.contactRepository.findListByOwnerId(ownerId);
    const group = ownedGroups.find((c) => c.label === groupLabel);
    if (!group) {
      throw new KyselyError('403', 'label not found in owned groups');
    }
    return group.id;
  };
}
