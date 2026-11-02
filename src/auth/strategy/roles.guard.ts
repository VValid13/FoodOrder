import { Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ForbiddenActionException } from '../../_utils/global.exception.js';
import type { UserEntity } from '../../users/users.entity.js';
import { PROTECT_OPTIONS_KEY } from '../_utils/constants/protect.constants.js';
import type { ProtectOptions } from '../_utils/types/protect-options.type.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<ProtectOptions | undefined>(
      PROTECT_OPTIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const roles = options?.roles ?? [];
    if (roles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request & { user: UserEntity }>();
    if (!roles.includes(user.role)) {
      throw ForbiddenActionException;
    }
    return true;
  }
}
