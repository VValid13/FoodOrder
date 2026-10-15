import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsUUID} from "class-validator";
import StrongPasswordDecorator from "../../../../_utils/decorators/strong-password.decorator.js";
import * as crypto from "crypto";

export class GetUserDto {
    @ApiProperty({example: 'U-U-I-D'})
    @IsNotEmpty()
    @IsUUID()
    id: crypto.UUID;

    @ApiProperty({ example: 'UserName' })
    @IsNotEmpty()
        //@IsUnique(User, { excludeDeleted: false }) // need isUnique utls
    username: string;
}