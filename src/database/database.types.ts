import {Generated} from "kysely";
import {UUID} from "crypto";

export interface UserTable{
    id: Generated<UUID>;
    mail: string;
    password_hash: string;
    hashed_refresh_token: string;
    display_name: string;
}

export interface DatabaseTables {
    user: UserTable;
}