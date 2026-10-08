import { HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ErrorCode } from '../_utils/constants/error-code.constants.js';
import {
  DATABASE_UNAVAILABLE_MESSAGE,
  HEALTH_STATUS_OK,
} from '../_utils/constants/health.constants.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  let controller: HealthController;
  const healthService = { isDatabaseUp: vi.fn<() => Promise<boolean>>() };

  beforeEach(async () => {
    healthService.isDatabaseUp.mockReset();

    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('returns ok when the database is up', async () => {
    healthService.isDatabaseUp.mockResolvedValue(true);

    await expect(controller.check()).resolves.toEqual({ status: HEALTH_STATUS_OK });
  });

  it('throws a 503 with DATABASE_UNAVAILABLE when the database is down', async () => {
    healthService.isDatabaseUp.mockResolvedValue(false);

    const error = await controller.check().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      code: ErrorCode.DATABASE_UNAVAILABLE,
      message: DATABASE_UNAVAILABLE_MESSAGE,
    });
  });
});
