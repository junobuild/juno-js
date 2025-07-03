#!/usr/bin/env node

import esbuild from 'esbuild';
import {externalPeerDependencies} from './pkg.mjs';
import {collectEntryPoints} from './utils.mjs';

const build = () => {
  const entryPoints = collectEntryPoints();

  esbuild
    .build({
      entryPoints,
      outdir: process.cwd(),
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      treeShaking: true,
      keepNames: true,
      format: 'esm',
      target: ['esnext'],
      platform: 'browser',
      supported: {
        'top-level-await': false,
        'inline-script': false,
        'dynamic-import': false
      },
      define: {
        self: 'globalThis'
      },
      external: externalPeerDependencies
    })
    .catch(() => process.exit(1));
};

export const buildFunctions = () => {
  build();
};
