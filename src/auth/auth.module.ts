import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/env.config.js';
import { TerminusModule } from '@nestjs/terminus';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { AuthService } from './auth.service.js';
import { RefreshTokenRepository } from './repositories/refresh-token.repository.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './strategy/jwt.strategy.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
    EncryptionModule,
    TerminusModule,
  ],
  providers: [AuthService, JwtStrategy, RefreshTokenRepository],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
