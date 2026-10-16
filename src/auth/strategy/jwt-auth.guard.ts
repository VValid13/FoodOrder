import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isActivated = await super.canActivate(context);
    return !!isActivated;
  }
  handleRequest(err: unknown, user: unknown, info: any, context: ExecutionContext) {
    if (info && info.message === 'jwt expired') throw new UnauthorizedException('TOKEN_EXPIRED');
    return super.handleRequest(err, user, info, context);
  }
}
