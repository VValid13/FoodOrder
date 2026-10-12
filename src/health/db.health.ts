import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicatorService } from '@nestjs/terminus';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import { Kysely } from 'kysely';
import type { DatabaseTables } from '../database/database.types.js';
import { DATABASE_UNAVAILABLE_MESSAGE } from '../_utils/constants/health.constants.js';
@Injectable()
export class DbHealthIndicator {
  constructor(
    @InjectKysely() private readonly db: Kysely<DatabaseTables>,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    try {
      await this.db.selectNoFrom((eb) => eb.val(1).as('health')).executeTakeFirst();
      return indicator.up();
    } catch (err) {
      return indicator.down({ postgres: `${DATABASE_UNAVAILABLE_MESSAGE} ${err}` });
    }
  }
}
