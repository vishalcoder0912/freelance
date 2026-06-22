import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/vitest-setup.ts'],
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover', 'cobertura'],
      reportOnFailure: true,
      include: ['src/**/*.js'],
      exclude: [
        'src/**/types.js',
        'src/**/*.d.ts',
        'src/config/firebase.js',
      ],
      thresholds: {
        functions: 95,
        branches: 90,
        lines: 90,
        statements: 90,
        perFile: true,
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: [
      'default',
      ['junit', { outputFile: './test-results/junit.xml' }],
      ['json', { outputFile: './test-results/test-results.json' }],
    ],
    outputFile: {
      json: './test-results/results.json',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
