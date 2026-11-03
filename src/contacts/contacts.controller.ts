import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { GroupLabelRequestDto } from './_utils/dtos/requests/group-label.request.dto.js';
import { MemberUsernameRequestDto } from './_utils/dtos/requests/member-username.request.dto.js';

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
  @ApiBody({ type: GroupLabelRequestDto })
  async createList(
    @GetUserPropertyInPayload() userId: crypto.UUID,
    @Body() groupLabelDto: GroupLabelRequestDto,
  ) {
    await this.contactService.createGroup(userId, groupLabelDto.label);
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

  @Patch('')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Get all owned lists' })
  async patchList() {
    console.log("@Patch('')");
  }

  @Delete('')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Delete group by id' })
  async delestList() {}
}
