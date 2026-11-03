import { Injectable } from '@nestjs/common';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { type UUID } from 'crypto';
import { UserEntity } from '../users/users.entity.js';
import { UserMapper } from '../users/users.mapper.js';

@Injectable()
export class ContactMapper {
  constructor(private readonly userMapper: UserMapper) {}

  toGroupMemberDto = (members: UserEntity[]): GroupMembersResponseDto => {
    return { users: members.map((e: UserEntity) => this.userMapper.toGetUserDto(e)) };
  };

  toNewGroup = (id: UUID, label: string) => {
    //console.log("temp mapper to id: "+id);
    return {
      id: crypto.randomUUID(),
      ownerId: id,
      label: label,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };
}
