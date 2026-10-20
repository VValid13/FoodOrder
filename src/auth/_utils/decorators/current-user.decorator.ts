import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { UserEntity } from '../../../users/users.entity.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): UserEntity =>
    context.switchToHttp().getRequest<Request & { user: UserEntity }>().user,
);
