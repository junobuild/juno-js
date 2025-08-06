#!/usr/bin/env node

const {generateDocumentation} = require('tsdoc-markdown');

const configInputFiles = [
  './packages/config/src/satellite/mainnet/juno.config.ts',
  './packages/config/src/satellite/configs/assertions.config.ts',
  './packages/config/src/satellite/configs/authentication.config.ts',
  './packages/config/src/satellite/configs/collections.ts',
  './packages/config/src/satellite/configs/datastore.config.ts',
  './packages/config/src/satellite/configs/emulator.config.ts',
  './packages/config/src/satellite/configs/module.settings.ts',
  './packages/config/src/satellite/configs/orbiter.config.ts',
  './packages/config/src/satellite/configs/rules.ts',
  './packages/config/src/satellite/configs/satellite.config.ts',
  './packages/config/src/shared/feature.config.ts',
  './packages/config/src/shared/storage.config.ts',
  './packages/config/src/types/juno.env.ts',
  './packages/config/src/satellite/dev/juno.dev.config.ts',
  './packages/config/src/satellite/dev/config.ts',
  './packages/config/src/types/encoding.ts',
  './packages/config/src/types/cli.config.ts'
];

const functionsInputFiles = [
  './packages/functions/src/index.ts',
  './packages/functions/src/sdk.ts',
  './packages/functions/src/ic-cdk.ts'
];

const buildOptions = {
  repo: {url: 'https://github.com/junobuild/juno-js'}
};

const markdownOptions = {
  headingLevel: '###'
};

generateDocumentation({
  inputFiles: configInputFiles,
  outputFile: './packages/config/README.md',
  markdownOptions,
  buildOptions: {...buildOptions, explore: false, types: true}
});

generateDocumentation({
  inputFiles: functionsInputFiles,
  outputFile: './packages/functions/README.md',
  markdownOptions,
  buildOptions: {...buildOptions, explore: true, types: true}
});
