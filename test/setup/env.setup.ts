import { ENV_FILE_PATH, ENV_KEYS } from '../../src/_utils/constants/env.constants.js';
import { getRequiredEnv } from '../../src/_utils/helpers/get-required-env.helper.js';

process.loadEnvFile(ENV_FILE_PATH);
process.env[ENV_KEYS.DATABASE_URL] = getRequiredEnv(ENV_KEYS.DATABASE_URL_TEST);
