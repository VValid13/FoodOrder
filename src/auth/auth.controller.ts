import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { CreateUserDto } from '../users/_utils/dtos/requests/create-user.dto.js';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import type { Request, Response } from 'express';
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
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(body.username, body.password);
    await this.authService.invalidateRefreshByUserID(user.id);
    const { accessToken, refreshToken, refreshTokenExpireAt } =
      await this.authService.generateToken(user);
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...getRefreshCookieOptions(this.isSecure()),
      expires: refreshTokenExpireAt,
    });
    return { accessToken, user: this.userService.getUser(user) };
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'revoke token from cookie and clear it' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (token) await this.authService.logout(token);
    res.clearCookie(REFRESH_COOKIE);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh token from cookie.' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token: string | undefined = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new UnauthorizedException('MISSING_REFRESH_TOKEN');
    const { accessToken, refreshToken, refreshTokenExpireAt } =
      await this.authService.refreshTokens(token);
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...getRefreshCookieOptions(this.isSecure()),
      expires: refreshTokenExpireAt,
    });
    return { accessToken };
  }
}
