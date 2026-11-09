import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { UserEntity } from '../../users/users.entity.js';

export const GetUserPropertyInPayload = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return user?.['id'];
});

export const ConnectedUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserEntity =>
    ctx.switchToHttp().getRequest<Request & { user: UserEntity }>().user,
);
