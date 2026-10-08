export const ENV_KEYS = {
  PORT: 'PORT',
  DATABASE_URL: 'DATABASE_URL',
  DATABASE_URL_TEST: 'DATABASE_URL_TEST',
  S3_BUCKET: 'S3_BUCKET',
  S3_BUCKET_TEST: 'S3_BUCKET_TEST',
} as const;

export type EnvKey = (typeof ENV_KEYS)[keyof typeof ENV_KEYS];

export const ENV_FILE_PATH = '.env';
