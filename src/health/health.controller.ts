import { Controller, Get} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HEALTH_ROUTE,
  HEALTH_TAG,
} from '../_utils/constants/health.constants.js';
import {HealthCheck, HealthCheckService} from "@nestjs/terminus";
import {DbHealthIndicator} from "./db.health.js";

@ApiTags(HEALTH_TAG)
@Controller(HEALTH_ROUTE)
export class HealthController {
  constructor(
      private readonly health: HealthCheckService,
      private readonly db: DbHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(){
    return this.health.check([
      () => this.db.isHealthy('database'),
    ])
  }
}
