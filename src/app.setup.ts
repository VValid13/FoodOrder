import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { SWAGGER_CUSTOM_OPTIONS } from './_utils/config/swagger-custom-options.config.js';
import { VALIDATION_PIPE_OPTIONS } from './_utils/config/validation-pipe-options.config.js';
import {
  SWAGGER_DESCRIPTION,
  SWAGGER_PATH,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
} from './_utils/constants/swagger.constants.js';
import { AppModule } from './app.module.js';

export function configureApp(app: INestApplication): void {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_PATH, app, document, SWAGGER_CUSTOM_OPTIONS);
}
