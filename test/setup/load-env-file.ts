import { existsSync } from 'node:fs';
import { ENV_FILE_PATH } from '../../src/_utils/constants/env.constants.js';

export function loadEnvFileIfPresent(): void {
  if (existsSync(ENV_FILE_PATH)) {
    process.loadEnvFile(ENV_FILE_PATH);
  }
}
