import { ENV_KEYS } from '../../src/_utils/constants/env.constants.js';
import { getRequiredEnv } from '../../src/_utils/helpers/get-required-env.helper.js';
import { loadEnvFileIfPresent } from './load-env-file.js';

loadEnvFileIfPresent();
process.env[ENV_KEYS.DATABASE_URL] = getRequiredEnv(ENV_KEYS.DATABASE_URL_TEST);
process.env[ENV_KEYS.S3_BUCKET] = getRequiredEnv(ENV_KEYS.S3_BUCKET_TEST);
