import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import * as crypto from 'crypto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //@Protect(UserRoleEnum.ADMIN)
  @Get(':userID')
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiOperation({ summary: 'Get user informations from id' })
  getUserById(@Param('userID') userID: crypto.UUID) {
    return this.userService.getUserById(userID);
  }
}
