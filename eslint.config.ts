import {default as config} from '@dfinity/eslint-config-oisy-wallet';

export default [
  ...config,
  {
    rules: {
      'local-rules/use-option-type-wrapper': ['off'],
      'prefer-arrow/prefer-arrow-functions': ['off'],
      'func-style': ['off']
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
      '**/esbuild.mjs'
    ]
  }
];
