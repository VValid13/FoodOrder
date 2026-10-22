import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import * as crypto from 'crypto';
import { Protect } from '../auth/_utils/decorators/protect.decorator.js';
import { UserMapper } from './users.mapper.js';
import type { Request } from 'express';
import { REFRESH_COOKIE } from '../auth/_utils/constants/refresh-token.constants.js';

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
  async getMe(@Req() req: Request) {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }
    return this.userMapper.toGetUserDto(await this.userService.getSelfUserByToken(token));
  }
  @Protect()
  @Post('/me/:newUsername')
  @ApiParam({ type: 'string', name: 'newUsername' })
  @ApiOperation({ summary: 'Get user informations from me' })
  async updateMe(@Req() req: Request, @Param('newUsername') newUsername: string) {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }
    return await this.userService.updateSelfUsernameByToken(token, newUsername);
  }
}
