import { Body, Controller, Get, Post, Patch, Delete, Param, NotFoundException } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { RenameGroupRequestDto } from './_utils/dtos/requests/rename-group.request.dto.js';
import { MemberRequestDto as MemberRequestDto } from './_utils/dtos/requests/member-username.request.dto.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';
import { CreateGroupRequestDto } from './_utils/dtos/requests/create-group.request.dto.js';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';
import { DeleteResult } from 'kysely';

@ApiTags('contact')
@Controller('contact')
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Protect()
  @Get()
  @ApiOkResponse({type: MyGroupsResponseDto})
  @ApiOperation({ summary: 'Get all owned group' })
  async getMyGroups(@GetUserPropertyInPayload() userId: UUID): Promise<MyGroupsResponseDto> {
    return await this.contactService.getMyGroups(userId);
  }

  @Protect()
  @Post()
  @ApiCreatedResponse({ type: MyGroupsResponseDto })
  @ApiBadRequestResponse({ description: 'group name format invalid (empty or too long)' })
  @ApiConflictResponse({ description: 'group name already present in owned groups' })
  @ApiOperation({ summary: 'create new empty group with defined label' })
  async createGroup(
    @GetUserPropertyInPayload() userId: UUID,
    @Body() groupLabelDto: CreateGroupRequestDto,
  ): Promise<MyGroupsResponseDto> {
    return await this.contactService.createGroup(userId, groupLabelDto.label);
  }

  @Protect()
  @Get('/:groupId/members')
  @ApiOkResponse({ type: GroupMembersResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiNotFoundResponse({ description: 'id not found in owned groups' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Get all members in group' })
  async getUsersInGroupByLabel(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
  ): Promise<GroupMembersResponseDto> {
    return await this.contactService.getUsersInGroupById(ownerId, groupId);
  }

  @Protect()
  @Post('/:groupId/members')
  @ApiCreatedResponse({type: Boolean})
  @ApiBadRequestResponse({ description: 'Invalid group id or invalid user id in body' })
  @ApiNotFoundResponse({ description: 'group id not found in owned groups or user id not found' })
  @ApiConflictResponse({ description: 'user already in group' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Add members in group by ids' })
  async addUserInGroupById(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Body() memberIdDto: MemberRequestDto,
  ): Promise<boolean> {
    return (await this.contactService.addUserInGroup(ownerId, groupId, memberIdDto.id)).insertId != undefined;
  }

  @Protect()
  @Delete('/:groupId/members/:memberId')
  @ApiAcceptedResponse({type: Boolean})
  @ApiBadRequestResponse({ description: 'Invalid group id or user id in body' })
  @ApiNotFoundResponse({ description: 'group id not found in owned groups or user id not found in group' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiParam({ type: 'UUID', name: 'memberId' })
  @ApiOperation({ summary: 'Remove member from group' })
  async deleteUsersInList(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Param('memberId') memberId: UUID,
  ): Promise<boolean> {
    return (await this.contactService.deleteUser(ownerId, groupId, memberId)).numDeletedRows > 0n;
  }

  @Protect()
  @Patch()
  @ApiAcceptedResponse({type: Boolean})
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiNotFoundResponse({ description: 'id not found in owned groups or user id not found' })
  @ApiNotFoundResponse({ description: 'group not found' })
  @ApiConflictResponse({ description: 'user already in group' })
  @ApiOperation({ summary: 'update group label' })
  async renameGroup(
    @GetUserPropertyInPayload() userId: UUID,
    @Body() groupLabelDto: RenameGroupRequestDto,
  ): Promise<boolean> {
    if (!groupLabelDto.oldLabel) {
      throw new NotFoundException('group not found');
    }
    return (await this.contactService.renameGroup(userId, groupLabelDto.oldLabel, groupLabelDto.newLabel)).numUpdatedRows > 0n;
  }

  @Protect()
  @Delete('/:groupId')
  @ApiOkResponse({type: Boolean})
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiNotFoundResponse({ description: 'id not found in owned groups' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Delete group by id' })
  async delestList(
    @GetUserPropertyInPayload() userId: UUID,
    @Param('groupId') groupId: UUID,
  ): Promise<boolean> {
    return (await this.contactService.deletGroup(userId, groupId)).numDeletedRows > 0n;
  }
}
