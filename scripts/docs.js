#!/usr/bin/env node

const {generateDocumentation} = require('tsdoc-markdown');

const configInputFiles = [
  './packages/config/src/mainnet/juno.config.ts',
  './packages/config/src/mainnet/juno.env.ts',
  './packages/config/src/dev/juno.dev.config.ts',
  './packages/config/src/dev/config.ts',
  './packages/config/src/types/encoding.ts'
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
