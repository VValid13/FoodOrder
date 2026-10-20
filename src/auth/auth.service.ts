import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { createHash, randomBytes, UUID } from 'node:crypto';
import dayjs from 'dayjs';
import { RefreshTokenRepository } from './repositories/refresh-token.repository.js';
import { UserEntity } from '../users/users.entity.js';
import { EncryptionService } from '../encryption/encryption.service.js';
import { AuthMapper } from './auth.mapper.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly userService: UsersService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly authMapper: AuthMapper,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsernameOrUnauthorized(username);
    const passwordStatus = await this.encryptionService.compare(password, user.passwordHash);
    if (!passwordStatus) throw new UnauthorizedException('INVALID CREDENTIALS');

    return user;
  }

  private hashRefreshToken = (rawToken: string) =>
    createHash('sha256').update(rawToken).digest('hex');

  async generateToken(user: UserEntity) {
    const payload = this.authMapper.toJwTokenInterface(user);
    const accessToken = this.jwtService.sign(payload);
    const rawRefreshToken = randomBytes(40).toString('hex');
    const expireAt = dayjs()
      .add(this.configService.get('REFRESH_TOKEN_EXPIRATION_DAYS'), 'day')
      .toDate();

    await this.refreshTokenRepository.create(
      user.id,
      this.hashRefreshToken(rawRefreshToken),
      expireAt,
    );
    return { accessToken, refreshToken: rawRefreshToken, refreshTokenExpireAt: expireAt };
  }

  async refreshTokens(rawToken: string) {
    try {
      const refreshSchema = await this.refreshTokenRepository.findIdByValidTokenHash(
        this.hashRefreshToken(rawToken),
      );
      await this.refreshTokenRepository.revokeByUserId(refreshSchema.userId);
      const user = await this.userService.getUserById(refreshSchema.userId);
      return this.generateToken(user);
    } catch {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }
  }
  async invalidateRefreshByUserID(userId: UUID) {
    await this.refreshTokenRepository.revokeByUserId(userId);
  }

  async logout(rawToken: string) {
    return await this.refreshTokenRepository.revokeByTokenHash(this.hashRefreshToken(rawToken));
  }
}
