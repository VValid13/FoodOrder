import { Controller, Get, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from '../_utils/constants/error-code.constants.js';
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  HEALTH_ROUTE,
  HEALTH_TAG,
} from '../_utils/constants/health.constants.js';
import { ErrorResponseDto } from '../_utils/dtos/error-response.dto.js';
import { buildErrorResponse } from '../_utils/helpers/build-error-response.helper.js';
import {HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator} from "@nestjs/terminus";
import {ENV_KEYS} from "../_utils/constants/env.constants.js";
import {DbHealthIndicator} from "./db.health.js";

@ApiTags(HEALTH_TAG)
@Controller(HEALTH_ROUTE)
export class HealthController {
  constructor(
      private readonly health: HealthCheckService,
      private readonly db: DbHealthIndicator,
      //private readonly http: HttpHealthIndicator

      //private readonly healthService: HealthService
  ) {}

  @Get()
  @HealthCheck()
  check(){
    return this.health.check([
      () => this.db.isHealthy('database'),
      //() => this.http.pingCheck('http connection check','validUrl'),
    ])
  }
  /*
  @ApiServiceUnavailableResponse({ type: ErrorResponseDto })
  @ApiOkResponse({ type: HealthResponseDto })

  async check(): Promise<HealthResponseDto> {
    if (!(await this.healthService.isDatabaseUp())) {
      throw new ServiceUnavailableException(
        buildErrorResponse(
          HttpStatus.SERVICE_UNAVAILABLE,
          ErrorCode.DATABASE_UNAVAILABLE,
          DATABASE_UNAVAILABLE_MESSAGE,
        ),
      );
    }

    return toHealthResponseDto();
  }
   */
}
