import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../strategy/jwt-auth.guard.js';
import { RolesGuard } from '../../strategy/roles.guard.js';
import {
  FORBIDDEN_ROLE_DESCRIPTION,
  PROTECT_OPTIONS_KEY,
  UNAUTHORIZED_DESCRIPTION,
} from '../constants/protect.constants.js';
import type { ProtectOptions } from '../types/protect-options.type.js';

export function Protect(options: ProtectOptions = {}) {
  const decorators = [
    SetMetadata(PROTECT_OPTIONS_KEY, options),
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiUnauthorizedResponse({ description: UNAUTHORIZED_DESCRIPTION }),
  ];
  if (options.roles?.length) {
    decorators.push(ApiForbiddenResponse({ description: FORBIDDEN_ROLE_DESCRIPTION }));
  }
  return applyDecorators(...decorators);
}
