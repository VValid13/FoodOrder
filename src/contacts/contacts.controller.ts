import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { GroupLabelRequestDto } from './_utils/dtos/requests/group-label.request.dto.js';
import { MemberUsernameRequestDto } from './_utils/dtos/requests/member-username.request.dto.js';
import { KyselyError } from '../_utils/kysely.error.js';

@ApiTags('contact-lists')
@Controller('contact-lists')
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Protect()
  @Get('')
  @ApiOperation({ summary: 'Get all owned group' })
  async getMyGroups(@GetUserPropertyInPayload() userId: crypto.UUID) {
    return await this.contactService.getMyGroups(userId);
  }

  @Protect()
  @Post('')
  @ApiOperation({ summary: 'create new empty group with defined label' })
  async createList(
    @GetUserPropertyInPayload() userId: crypto.UUID,
    @Body() groupLabelDto: GroupLabelRequestDto,
  ) {
    await this.contactService.createGroup(userId, groupLabelDto.newLabel);
  }

  @Protect()
  @Get('/:label/members')
  @ApiParam({ type: 'string', name: 'label' })
  @ApiOperation({ summary: 'Get all members in group' })
  async getUsersInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('label') groupLabel: string,
  ) {
    return await this.contactService.getUsersInGroupByLabel(ownerId, groupLabel);
  }

  @Protect()
  @Post('/:label/members')
  @ApiParam({ type: 'string', name: 'label' })
  @ApiOperation({ summary: 'Add members with defined username in group' })
  async addUserInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('label') groupLabel: string,
    @Body() memberUsernameDto: MemberUsernameRequestDto,
  ) {
    await this.contactService.addUserInGroup(ownerId, groupLabel, memberUsernameDto.username);
  }

  @Protect()
  @Delete('/:label/members')
  @ApiParam({ type: 'UUID', name: 'memberUSername' })
  @ApiOperation({ summary: 'Remove member from group' })
  async deleteUsersInList(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('label') groupLabel: string,
    @Body() memberUsernameDto: MemberUsernameRequestDto,
  ) {
    await this.contactService.deleteUserFromGroup(ownerId, groupLabel, memberUsernameDto.username);
  }

  @Protect()
  @Patch('')
  @ApiOperation({ summary: 'update group label' })
  async renameGroup(
    @GetUserPropertyInPayload() userId: crypto.UUID,
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
    @GetUserPropertyInPayload() userId: crypto.UUID,
    @Param('label') groupLabel: string,
  ) {
    await this.contactService.deletGroup(userId, groupLabel);
  }
}
