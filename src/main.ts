import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { EnvironmentVariables } from './_utils/config/env.config.js';
import { ENV_KEYS } from './_utils/constants/env.constants.js';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';
import cookieParser from 'cookie-parser';
import {PostgresExeptionFilter} from "./_utils/filters/postgres.exeption.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  app.use(cookieParser());
  app.useGlobalFilters(new PostgresExeptionFilter())
  //app.useGlobalFilters(new KyselyExceptionFilter())

  await app.listen(configService.getOrThrow(ENV_KEYS.PORT, { infer: true }));
}

void bootstrap();
