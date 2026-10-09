import {Injectable} from "@nestjs/common";
import {HealthIndicatorService} from "@nestjs/terminus";
import {InjectKysely} from "../_utils/decorators/inject-kysely.decorator.js";
import {Kysely, sql} from "kysely";
import type {DB} from "../database/database.types.js";

@Injectable()
export class DbHealthIndicator{
    constructor(
        @InjectKysely() private readonly db: Kysely<DB>,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    isHealthy(key: string) {
        return this.healthIndicatorService
            .check(key)
            .attempt( async ({signal}) => {
                /*
                const response = await fetch('localhost:5432', {signal});
                const {message: breeds} = await response.json();

                return {breeds: breeds.length };
                 */
                try {
                    //await this.db.selectAll().execute()
                    await sql`select 1`.execute(this.db);
                    return ;
                } catch {
                    return {message: 'testMsg'};
                }
            })
            .withTimeout(1000);
    }
}
