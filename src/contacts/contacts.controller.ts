import {Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import * as crypto from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';


@ApiTags('contact-lists')
@Controller('contact-lists')
export class ContactsController {
  constructor(
    private readonly contactService: ContactService,
    //private readonly userMapper: UserMapper,
  ) {}

  @Protect()
  @Get('')
  @ApiOperation({ summary: 'Get all owned lists' })
  async getMyLists(@GetUserPropertyInPayload() userId: crypto.UUID) {
    return await this.contactService.getMyLists(userId)
  }
  
  @Protect()
  @Post('')
  @ApiOperation({ summary: 'create new empty group' })
  async createList(
    @GetUserPropertyInPayload() userId: crypto.UUID,
    @Body() label :{label: string}
  ) {
    await this.contactService.createGroup(userId, label.label);
  }    

  /*
  @Get('/:id/members')
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Get all members in list' })
  async getUsersInGroupById(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('id') groupId: crypto.UUID
  ) {
    return await this.contactService.getUsersInGroupById(ownerId, groupId);
  }
  */

  @Protect()
  @Get('/:label/members')
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Get all members in list' })
  async getUsersInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('label') groupLabel: string
  ) {
   return await this.contactService.getUsersInGroupByLabel(ownerId, groupLabel);
  }
 /*
 @Protect()
 @Post('/:id/members')
 @ApiParam({ type: 'UUID', name: 'groupId' })
 @ApiOperation({ summary: 'Get all members in list' })
 async addUser(
  @GetUserPropertyInPayload() ownerId: crypto.UUID,
  @Param('id') groupId: crypto.UUID,
  @Body() invitedUser: {username: string}
  ) {
    console.log('by id')
    return await this.contactService.addUserInGroup(ownerId, groupId, invitedUser.username);
  }
  */

  @Protect()
  @Post('/:label/members')
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Get all members in list' })
  async addUserInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: crypto.UUID,
    @Param('label') groupLabel: string,
    @Body() invitedUser: {username: string}
  ) {
    await this.contactService.addUserInGroupByLabel(ownerId, groupLabel, invitedUser.username);
  }

  @Patch('/:id/members/:memberId')
  @ApiOperation({ summary: 'Patch member in list' })
  async patchUsersInList() {
  console.log("@Patch('/:id/members/:memberId')")
  }

  @Patch('')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Get all owned lists' })
  async patchList() {
    console.log("@Patch('')")
  }
  
  @Delete('')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Delete group by id' })
  async delestList() {
    
  }
}
