import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  constructor(
    private readonly contactService: ContactService,
    //private readonly userMapper: UserMapper,
  ) {}

  @Protect()
  @Get('')
  @ApiOperation({ summary: 'Get all owned group' })
  async getMyLists(@GetUserPropertyInPayload() userId: crypto.UUID) {
    return await this.contactService.getMyLists(userId);
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
  @ApiOperation({ summary: 'Get all members in list' })
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
    await this.contactService.addUserInGroupByLabel(
      ownerId,
      groupLabel,
      memberUsernameDto.username,
    );
  }

  @Patch('/:id/members/:memberId')
  @ApiOperation({ summary: 'Patch member in list' })
  async patchUsersInList() {
    console.log("@Patch('/:id/members/:memberId')");
  }

  @Protect()
  @Patch('')
  @ApiOperation({ summary: 'update group label' })
  async renameGroup(
    @GetUserPropertyInPayload() userId: crypto.UUID,
    @Body() groupLabelDto: GroupLabelRequestDto,
  ) {
    console.log(`patch from ${groupLabelDto.oldLabel} to ${groupLabelDto.newLabel}`)
    if(!groupLabelDto.oldLabel){throw new KyselyError('404', "group not found")}
    await this.contactService.renameGroup(userId, groupLabelDto.oldLabel, groupLabelDto.newLabel);
  }

  @Delete('')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Delete group by id' })
  async delestList() {}
}
