#!/usr/bin/env node

const {generateDocumentation} = require('tsdoc-markdown');

const configInputFiles = [
  './packages/config/src/types/juno.config.ts',
  './packages/config/src/types/encoding.ts',
  './packages/config/src/types/juno.env.ts',
  './packages/config/src/types/storage.config.ts'
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
  buildOptions: {...buildOptions, explore: true, types: true}
});
