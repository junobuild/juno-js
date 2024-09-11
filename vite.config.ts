import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['packages/src/**/*.spec.ts'],
    globals: true,
    watch: false,
    passWithNoTests: true
  }
});
