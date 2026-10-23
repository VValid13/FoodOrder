import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserPropertyInPayload = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return user?.['id'];
});
