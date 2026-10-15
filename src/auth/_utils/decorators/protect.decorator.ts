import {applyDecorators, SetMetadata, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../strategy/jwt-auth.huatd.js";

export function Protect(){
    return applyDecorators(
        ApiBearerAuth(),
        UseGuards(JwtAuthGuard),
        ApiUnauthorizedResponse({description: 'unauthorized'}),
    )
}