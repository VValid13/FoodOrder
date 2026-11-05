import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { GroupLabelRequestDto } from './_utils/dtos/requests/group-label.request.dto.js';
import { MemberRequestDto as MemberRequestDto } from './_utils/dtos/requests/member-username.request.dto.js';
import { KyselyError } from '../_utils/kysely.error.js';

@ApiTags('contact-lists')
@Controller('contact-lists')
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Protect()
  @Get()
  @ApiOperation({ summary: 'Get all owned group' })
  async getMyGroups(@GetUserPropertyInPayload() userId: UUID) {
    return await this.contactService.getMyGroups(userId);
  }

  @Protect()
  @Post()
  @ApiOperation({ summary: 'create new empty group with defined label' })
  async createList(
    @GetUserPropertyInPayload() userId: UUID,
    @Body() groupLabelDto: GroupLabelRequestDto,
  ) {
    await this.contactService.createGroup(userId, groupLabelDto.newLabel);
  }

  @Protect()
  @Get('/:groupId/members')
  @ApiParam({ type: 'string', name: 'label' })
  @ApiOperation({ summary: 'Get all members in group' })
  async getUsersInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
  ) {
    return await this.contactService.getUsersInGroupByLabel(ownerId, groupId);
  }

  @Protect()
  @Post('/:groupId/members')
  @ApiParam({ type: 'string', name: 'label' })
  @ApiOperation({ summary: 'Add members with defined username in group' })
  async addUserInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Body() memberIdDto: MemberRequestDto,
  ) {
    await this.contactService.addUserInGroup(ownerId, groupId, memberIdDto.id);
  }

  @Protect()
  @Delete('/:groupId/members/:memberId')
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiParam({ type: 'UUID', name: 'memberId' })
  @ApiOperation({ summary: 'Remove member from group' })
  async deleteUsersInList(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Param('memberId') memberId: UUID,
  ) {
    await this.contactService.deleteUser(ownerId, groupId, memberId);
  }

  @Protect()
  @Patch()
  @ApiOperation({ summary: 'update group label' })
  async renameGroup(
    @GetUserPropertyInPayload() userId: UUID,
    @Body() groupLabelDto: GroupLabelRequestDto,
  ) {
    if (!groupLabelDto.oldLabel) {
      throw new KyselyError('404', 'group not found');
    }
    await this.contactService.renameGroup(userId, groupLabelDto.oldLabel, groupLabelDto.newLabel);
  }

  @Protect()
  @Delete('/:label')
  @ApiParam({ type: 'string', name: 'label' })
  @ApiOperation({ summary: 'Delete group by label' })
  async delestList(
    @GetUserPropertyInPayload() userId: UUID,
    @Param('label') groupLabel: string,
  ) {
    await this.contactService.deletGroup(userId, groupLabel);
  }
}
