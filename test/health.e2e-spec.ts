import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { HEALTH_ROUTE, HEALTH_STATUS_OK } from '../src/_utils/constants/health.constants.js';
import { SWAGGER_PATH } from '../src/_utils/constants/swagger.constants.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns 200', async () => {
    await request(app.getHttpServer())
      .get(`/${HEALTH_ROUTE}`)
      .expect(200)
      .expect({ status: HEALTH_STATUS_OK });
  });

  it('documents /health in the OpenAPI document', async () => {
    const response = await request(app.getHttpServer()).get(`/${SWAGGER_PATH}-json`).expect(200);

    expect(response.body.paths).toHaveProperty(`/${HEALTH_ROUTE}`);
  });
});
