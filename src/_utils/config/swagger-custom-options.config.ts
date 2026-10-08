import type { SwaggerCustomOptions } from '@nestjs/swagger';

export const SWAGGER_CUSTOM_OPTIONS: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    tryItOutEnabled: true,
    displayRequestDuration: true,
    filter: true,
  },
};
