import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { createHash, randomBytes } from 'node:crypto';
import dayjs from 'dayjs';
import JwtPayloadInterface from './_utils/interfaces/jwt-payload.interface.js';
import { RefreshTokenRepository } from './repositories/refresh-token.repository.js';
import { UserSchema } from '../users/users.schema.js';
import { UsersRepository } from '../users/users.repository.js';
import { EncryptionService } from '../encryption/encryption.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async validateUser(username: string, password: string) {
    const user: UserSchema = await this.usersRepository.findOneByUsernameOrThrow(username);
    console.log(user);
    console.log(user.username);
    console.log(`compare pass: ${password} with hash: ${user.passwordHash}`);
    const passwordStatus = await this.encryptionService.compare(password, user.passwordHash);

    if (!passwordStatus) throw new UnauthorizedException('INVALID CREDENTIALS');

    return user;
  }

  //Move in mapper?
  private hasRefreshToken = (rawToken: string) =>
    createHash('sha256').update(rawToken).digest('hex');

  async generateToken(user: UserSchema) {
    const payload: JwtPayloadInterface = { username: user.username, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    const rawRefreshToken = randomBytes(40).toString('hex');
    const expireAt = dayjs()
      .add(this.configService.get('REFRESH_TOKEN_EXPIRATION_DAYS'), 'day')
      .toDate();

    await this.refreshTokenRepository.create(
      user.id,
      this.hasRefreshToken(rawRefreshToken),
      expireAt,
    );
    return { accessToken, refreshToken: rawRefreshToken, refreshTokenExpireAt: expireAt };
  }

  async refreshTokens(rawToken: string) {
    const tokenDoc = await this.refreshTokenRepository.findValidByTokenHashAndRevoke(
      this.hasRefreshToken(rawToken),
    );
    if (!tokenDoc) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const user = await this.usersRepository.findById(tokenDoc.id_user);
    if (!user) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    return this.generateToken(user);
  }

  logout(rawToken: string) {
    return this.refreshTokenRepository.revokeByTokenHash(this.hasRefreshToken(rawToken));
  }
}
