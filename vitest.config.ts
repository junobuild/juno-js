import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    passWithNoTests: true,
    typecheck: {
      tsconfig: 'tsconfig.spec.json'
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
