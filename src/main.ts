import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ENV_KEYS } from './_utils/constants/env.constants.js';
import { AppModule } from './app.module.js';
import { configureApp } from './app.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<string>(ENV_KEYS.PORT));
}

void bootstrap();
