import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { type UUID } from "crypto";

@Injectable()
export class ContactsExceptions {
  userNotFoundInGroup(memberId: UUID): NotFoundException {
    return new NotFoundException('user not found');
  }
  groupNotFoundInOwnedGroups(groupId: UUID): NotFoundException {
    return new NotFoundException('group id not found in owned groups');
  }
  invalidEntityId(guivenId: string): BadRequestException {
    return new BadRequestException(`Invalid group id: ${guivenId}`)
  }
}
