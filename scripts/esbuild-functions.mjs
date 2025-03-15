#!/usr/bin/env node

import esbuild from 'esbuild';
import {copyPackageJsonFiles, externalPeerDependencies} from './esbuild-pkg.mjs';
import {collectEntryPoints, createDistFolder, DIST} from './esbuild-utils.mjs';

const build = () => {
  const entryPoints = collectEntryPoints();

  esbuild
    .build({
      entryPoints,
      outdir: DIST,
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      treeShaking: true,
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
  createDistFolder();
  copyPackageJsonFiles();
  build();
};
