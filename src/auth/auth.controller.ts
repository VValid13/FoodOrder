import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { CreateUserDto } from '../users/_utils/dtos/requests/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import express from 'express';
import {
  REFRESH_COOKIE,
  getRefreshCookieOptions,
} from './_utils/constants/refresh-token.constants.js';
import { LoginDto } from './_utils/dtos/requests/login.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  private isSecure = () => this.configService.get('NODE_ENV') === 'production';

  @Post('register')
  @ApiOperation({ summary: 'Register user' })
  register(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const user = await this.authService.validateUser(body.username, body.password);
    const { accessToken, refreshToken, refreshTokenExpireAt } =
      await this.authService.generateToken(user);
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...getRefreshCookieOptions(this.isSecure()),
      expires: refreshTokenExpireAt,
    });
    return { accessToken, user };
  }
}
