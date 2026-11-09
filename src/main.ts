import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { EnvironmentVariables } from './_utils/config/env.config.js';
import { ENV_KEYS } from './_utils/constants/env.constants.js';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { PostgresExceptionFilter } from './_utils/filters/postgres-exception-filter.js';

async function bootstrap() {
  dayjs.extend(customParseFormat);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  app.use(cookieParser());
  app.useGlobalFilters(new PostgresExceptionFilter());

  await app.listen(configService.getOrThrow(ENV_KEYS.PORT, { infer: true }));
}

void bootstrap();
