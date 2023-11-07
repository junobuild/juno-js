#!/usr/bin/env node

import esbuild from 'esbuild';
import {readFileSync, readdirSync, statSync} from 'fs';
import {join} from 'path';
import {build} from '../../scripts/esbuild.mjs';

build();

// Skip peer dependencies
const peerDependencies = (packageJson) => {
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies} = JSON.parse(json);
  return peerDependencies ?? {};
};

const workspacePeerDependencies = peerDependencies(join(process.cwd(), 'package.json'));

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
      external: [...Object.keys(workspacePeerDependencies)]
    })
    .catch(() => process.exit(1));
};

buildWebWorkers();
