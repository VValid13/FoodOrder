import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import * as crypto from 'crypto';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { UserMapper } from './users.mapper.js';
import { ChangeUsernameDto } from './_utils/dtos/requests/change-username.dto.js';
import { GetUserPropertyInPayload } from '../_utils/decorators/connected-user-decorator.js';
import * as nodeCrypto from 'node:crypto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userMapper: UserMapper,
  ) {}

  @Protect()
  @Get('/id/:userID')
  @ApiParam({ type: 'UUID', name: 'userId' })
  @ApiOperation({ summary: 'Get user informations from id' })
  async getUserById(@Param('userID') userID: crypto.UUID) {
    return this.userMapper.toGetUserDto(await this.userService.getUserById(userID));
  }

  @Protect()
  @Get('/name/:username')
  @ApiParam({ type: 'string', name: 'username' })
  @ApiOperation({ summary: 'Get user informations from username' })
  async getUserByUsername(@Param('username') username: string) {
    return this.userMapper.toGetUserDto(await this.userService.getUserByUsername(username));
  }

  @Protect()
  @Get('/me')
  @ApiOperation({ summary: 'Get user informations from me' })
  async getMe(@GetUserPropertyInPayload() userId: nodeCrypto.UUID) {
    return this.userMapper.toGetUserDto(await this.userService.getUserByIdOrUnauthorized(userId));
  }

  @Protect()
  @Post('/me')
  @ApiOperation({ summary: 'Get user informations from me' })
  async updateMe(
    @Body() changeUsernameDto: ChangeUsernameDto,
    @GetUserPropertyInPayload() userId: nodeCrypto.UUID,
  ) {
    return await this.userService.updateSelfUsername(changeUsernameDto, userId);
  }
}
