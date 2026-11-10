import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionsService } from '../sessions/sessions.service.js';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);

  constructor(private readonly sessionsService: SessionsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async cronEveryMinute(): Promise<void> {
    const closedCount = await this.sessionsService.closeExpiredSessions();
    if (closedCount > 0) {
      this.logger.log(`${closedCount} expired session(s) closed`);
    }
  }
}
