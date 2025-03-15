#!/usr/bin/env node

import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';
import esbuild from 'esbuild';
import {join} from 'path';
import {externalPeerDependencies} from './pkg.mjs';
import {collectEntryPoints, createDistFolder, DIST, writeEntries} from './utils.mjs';

const entryPoints = collectEntryPoints();

const buildBrowser = () => {
  // esm output bundles with code splitting
  esbuild
    .build({
      entryPoints,
      outdir: join(DIST, 'browser'),
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      format: 'esm',
      target: ['esnext'],
      platform: 'browser',
      conditions: ['worker', 'browser'],
      plugins: [NodeModulesPolyfillPlugin()],
      external: externalPeerDependencies
    })
    .catch(() => process.exit(1));
};

const buildNode = () => {
  // esm output bundle for Node
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outfile: join(DIST, 'node', 'index.mjs'),
      bundle: true,
      sourcemap: true,
      minify: true,
      format: 'esm',
      platform: 'node',
      target: ['node20', 'esnext'],
      banner: {
        js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
      },
      external: externalPeerDependencies
    })
    .catch(() => process.exit(1));
};

export const build = (bundle = 'browser_and_node') => {
  createDistFolder();

  switch (bundle) {
    case 'browser': {
      buildBrowser();
      writeEntries();
      break;
    }
    case 'node': {
      buildNode();
      break;
    }
    default: {
      buildBrowser();
      buildNode();
      writeEntries();
    }
  }
};
