#!/usr/bin/env node

const {generateDocumentation} = require('tsdoc-markdown');

const configInputFiles = [
  './packages/config/src/satellite/mainnet/juno.config.ts',
  './packages/config/src/types/juno.env.ts',
  './packages/config/src/satellite/dev/juno.dev.config.ts',
  './packages/config/src/satellite/dev/config.ts',
  './packages/config/src/types/encoding.ts',
  './packages/config/src/types/cli.config.ts'
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
