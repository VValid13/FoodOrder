import { plainToInstance } from 'class-transformer';
import { IsInt, IsUrl, Max, Min, validateSync } from 'class-validator';
import { MAX_PORT, MIN_PORT } from '../constants/env.constants.js';
import { IsNotEmptyString } from '../decorators/is-not-empty-string.decorator.js';

export class EnvironmentVariables {
  @IsInt()
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  PORT: number;

  @IsUrl({ require_tld: false, require_protocol: true })
  FRONT_ORIGIN: string;

  @IsNotEmptyString()
  DATABASE_URL: string;

  @IsNotEmptyString()
  JWT_SECRET: string;

  @IsNotEmptyString()
  JWT_REFRESH_SECRET: string;

  @IsUrl({ require_tld: false, require_protocol: true })
  S3_ENDPOINT: string;

  @IsNotEmptyString()
  S3_REGION: string;

  @IsNotEmptyString()
  S3_ACCESS_KEY: string;

  @IsNotEmptyString()
  S3_SECRET_KEY: string;

  @IsNotEmptyString()
  S3_BUCKET: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map((error) => `${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return validatedConfig;
}
