import {default as config} from '@dfinity/eslint-config-oisy-wallet';

export default [
  ...config,
  {
    linterOptions: {
      // eslint --fix removes @typescript-eslint/prefer-nullish-coalescing but complains about it in CI 😫
      reportUnusedDisableDirectives: false
    },
    rules: {
      'prefer-arrow/prefer-arrow-functions': ['off'],
      'func-style': ['off']
    }
  },
  {
    files: ['packages/cli-tools/**/*'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    ignores: [
      '**/dist/',
      '**/declarations/',
      '*.did.js',
      '*_pb.d.ts',
      'jest.config.js',
      'test-setup.ts',
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.mock.ts',
      'scripts/**/*',
      'packages/core-peer/src/**/*',
      'packages/core-standalone/src/**/*',
      'eslint-local-rules.cjs',
      '**/esbuild.mjs',
      'demo/**/*'
    ]
  },
  {
    ignores: [
      'packages/**/*.js',
      'packages/**/*.mjs',
      'packages/**/*.d.ts',

      '!packages/**/declarations/**/*.js',
      '!packages/**/declarations/**/*.mjs',
      '!packages/**/declarations/**/*.d.ts',

      '!packages/**/global.d.ts'
    ]
  }
];
