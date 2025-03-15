#!/usr/bin/env node

import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';
import esbuild from 'esbuild';
import {readdirSync, statSync} from 'fs';
import {join} from 'path';
import {build} from '../../scripts/esbuild/build.mjs';

build();

// Build web workers

const buildWebWorkers = () => {
  const entryPoints = readdirSync(join(process.cwd(), 'src', 'workers'))
    .filter(
      (file) =>
        !file.includes('test') &&
        !file.includes('spec') &&
        !file.endsWith('.swp') &&
        statSync(join(process.cwd(), 'src', 'workers', file)).isFile()
    )
    .map((file) => `src/workers/${file}`);

  esbuild
    .build({
      entryPoints,
      outdir: 'dist/workers',
      bundle: true,
      sourcemap: 'external',
      minify: true,
      target: ['node18'],
      conditions: ['worker'],
      plugins: [NodeModulesPolyfillPlugin()]
    })
    .catch(() => process.exit(1));
};

buildWebWorkers();
