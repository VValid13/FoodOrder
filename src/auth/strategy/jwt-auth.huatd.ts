import {ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isActivated = await super.canActivate(context);
        return !(!isActivated);
        //if(!isActivated) return false;
    }
    handleRequest(err:any,user:any,info:any,context:ExecutionContext){
        if(info && info.message ==='jwt expired') throw new ForbiddenException('TOKEN_EXPIRED');
        return super.handleRequest(err,user,info,context);
    }
}