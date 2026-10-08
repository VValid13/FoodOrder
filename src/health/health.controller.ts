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
import { HealthResponseDto } from './dto/health-response.dto.js';
import { toHealthResponseDto } from './health.mapper.js';
import { HealthService } from './health.service.js';

@ApiTags(HEALTH_TAG)
@Controller(HEALTH_ROUTE)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  @ApiServiceUnavailableResponse({ type: ErrorResponseDto })
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
}
