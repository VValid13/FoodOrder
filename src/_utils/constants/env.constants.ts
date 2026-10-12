import { EnvironmentVariables } from '../config/env.config.js';
import {ValueOf} from "../utils.types.js";

export const ENV_KEYS = {
  PORT: 'PORT',
  DATABASE_URL: 'DATABASE_URL',
  JWT_SECRET: 'JWT_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  S3_ENDPOINT: 'S3_ENDPOINT',
  S3_REGION: 'S3_REGION',
  S3_ACCESS_KEY: 'S3_ACCESS_KEY',
  S3_SECRET_KEY: 'S3_SECRET_KEY',
  S3_BUCKET: 'S3_BUCKET',
} as const satisfies Record<string, keyof EnvironmentVariables>;

export type EnvType = ValueOf<typeof ENV_KEYS>;

export const ENV_FILE_PATH = '.env';
export const MIN_PORT = 1;
export const MAX_PORT = 65_535;
