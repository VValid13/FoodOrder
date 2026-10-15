import {Generated} from "kysely";
import {UUID} from "crypto";

export interface UserTable{
    id: Generated<UUID>;
    username: string;
    passwordHash: string;
}

export interface TokenTable{
    id: Generated<UUID>;
    token: string;
    expireAt: Date;
    status: boolean;
    idUser: UUID
}

export interface DatabaseTables {
    user: UserTable;
    token: TokenTable;
}