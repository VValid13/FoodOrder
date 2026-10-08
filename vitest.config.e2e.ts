import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.e2e-spec.ts'],
    fileParallelism: false,
    globalSetup: ['test/setup/global-setup.ts'],
    setupFiles: ['test/setup/env.setup.ts'],
  },
});
