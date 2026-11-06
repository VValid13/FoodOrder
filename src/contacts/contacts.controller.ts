import { Body, Controller, Get, Post, Patch, Delete, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { type UUID } from 'crypto';
import { ContactService } from './contacts.service.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { RenameGroupRequestDto } from './_utils/dtos/requests/rename-group.request.dto.js';
import { MemberRequestDto } from './_utils/dtos/requests/member-username.request.dto.js';
import { MyGroupsResponseDto } from './_utils/dtos/responses/my-groups.response.dto.js';
import { CreateGroupRequestDto } from './_utils/dtos/requests/create-group.request.dto.js';
import { GroupMembersResponseDto } from './_utils/dtos/responses/group-members.response.dto.js';

@ApiTags('contact')
@Controller('contact')
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Protect()
  @Get()
  @ApiOkResponse({ type: MyGroupsResponseDto })
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
  @ApiCreatedResponse()
  @ApiBadRequestResponse({ description: 'Invalid group id or invalid user id in body' })
  @ApiNotFoundResponse({ description: 'group id not found in owned groups' })
  @ApiNotFoundResponse({ description: 'user id not found in group' })
  @ApiConflictResponse({ description: 'user already in group' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Add members in group by ids' })
  async addUserInGroupById(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Body() memberIdDto: MemberRequestDto,
  ): Promise<void> {
    await this.contactService.addUserInGroup(ownerId, groupId, memberIdDto.id);
  }

  @Protect()
  @Delete('/:groupId/members/:memberId')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Invalid group id or user id in body' })
  @ApiNotFoundResponse({ description: 'group id not found in owned groups' })
  @ApiNotFoundResponse({ description: 'user id not found in group' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiParam({ type: 'UUID', name: 'memberId' })
  @ApiOperation({ summary: 'Remove member from group' })
  async deleteUsersInList(
    @GetUserPropertyInPayload() ownerId: UUID,
    @Param('groupId') groupId: UUID,
    @Param('memberId') memberId: UUID,
  ): Promise<void> {
    await this.contactService.deleteUser(ownerId, groupId, memberId);
  }

  @Protect()
  @Patch()
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'new group name format invalid (empty or too long)' })
  @ApiNotFoundResponse({ description: 'id not found in owned groups' })
  @ApiConflictResponse({ description: 'group label already exist in this group' })
  @ApiOperation({ summary: 'update group label' })
  async renameGroup(
    @GetUserPropertyInPayload() userId: UUID,
    @Body() groupLabelDto: RenameGroupRequestDto,
  ): Promise<void> {
    await this.contactService.renameGroup(userId, groupLabelDto.groupId, groupLabelDto.newLabel);
  }

  @Protect()
  @Delete('/:groupId')
  @ApiOkResponse()
  @ApiBadRequestResponse({ description: 'Invalid group id' })
  @ApiNotFoundResponse({ description: 'id not found in owned groups' })
  @ApiParam({ type: 'UUID', name: 'groupId' })
  @ApiOperation({ summary: 'Delete group by id' })
  async delestList(
    @GetUserPropertyInPayload() userId: UUID,
    @Param('groupId') groupId: UUID,
  ): Promise<void> {
    await this.contactService.deletGroup(userId, groupId);
  }
}
