import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import * as crypto from 'crypto';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { UserMapper } from './users.mapper.js';

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
}
