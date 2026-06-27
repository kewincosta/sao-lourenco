import path from 'node:path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@sao-lourenco/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
  // esbuild (Vitest's default) does NOT emit decorator metadata, which TypeORM
  // relies on. SWC transforms TS with legacy decorators + metadata enabled.
  plugins: [
    swc.vite({
      jsc: {
        target: 'es2022',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{spec,test}.ts'],
    setupFiles: ['reflect-metadata'],
    // E2E tests share a single Postgres database, so run them in one process.
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    hookTimeout: 30_000,
    testTimeout: 30_000,
  },
});
