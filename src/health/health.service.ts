import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { InjectKysely } from '../_utils/decorators/inject-kysely.decorator.js';
import type { DB } from '../database/database.types.js';

@Injectable()
export class HealthService {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  async isDatabaseUp(): Promise<boolean> {
    try {
      await sql`select 1`.execute(this.db);
      return true;
    } catch {
      return false;
    }
  }
}
