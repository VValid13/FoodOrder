import {Generated} from "kysely";
import {UUID} from "crypto";

export interface UserTable{
    id: Generated<UUID>;
    username: string;
    passwordHash: string;
}

export interface TokenTable{
    id: Generated<UUID>;
    tokenHash: string;
    expireAt: Date;
    isActive: boolean;
    userId: UUID
}

export interface DatabaseTables {
    user: UserTable;
    token: TokenTable;
}