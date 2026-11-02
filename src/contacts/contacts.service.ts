import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contacts.repository.js';
import { UUID } from 'crypto';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    //private readonly userMapper: UserMapper,
    //private readonly encryptionService: EncryptionService,
  ) {}
  async getMyLists(ownerId: UUID) {
    return await this.contactRepository.findListByOwnerId(ownerId);
  }

  async getUsersInList(ownerId: UUID, groupId: UUID) {
    return await this.contactRepository.getGroupMembers(ownerId,groupId);
  }

  async patchUsersInList() {}

  private tempMapper = (id: UUID) => {
    //console.log("temp mapper to id: "+id);
    return {
      id: crypto.randomUUID(),
      ownerId: id,
      label: 'Label',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  async createGroup(ownerId: UUID) {
    const newGroup = this.tempMapper(ownerId);
    //console.log(newGroup);
    return await this.contactRepository.createEmptyGroup(newGroup);
  }

  async patchList() {}

  async delestList() {}
}
