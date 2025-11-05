#!/usr/bin/env node

import esbuild from 'esbuild';
import {join} from 'path';
import {externalPeerDependencies} from './pkg.mjs';
import {collectEntryPoints, createDistFolder, DIST, writeEntries} from './utils.mjs';

const entryPoints = collectEntryPoints();

const buildBrowser = ({multi} = {multi: false}) => {
  // esm output bundles with code splitting
  esbuild
    .build({
      entryPoints,
      outdir: multi === true ? process.cwd() : join(DIST, 'browser'),
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      format: 'esm',
      target: ['esnext'],
      platform: 'browser',
      conditions: ['worker', 'browser'],
      external: externalPeerDependencies
    })
    .catch(() => process.exit(1));
};

const buildNode = ({multi} = {multi: false}) => {
  // esm output bundle for Node
  esbuild
    .build({
      ...(multi === true
        ? {entryPoints, outdir: process.cwd(), outExtension: {'.js': '.mjs'}}
        : {entryPoints: ['src/index.ts'], outfile: join(DIST, 'node', 'index.mjs')}),
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

export const build = ({bundle, multi} = {bundle: 'browser_and_node', multi: false}) => {
  createDistFolder();

  switch (bundle) {
    case 'browser': {
      buildBrowser({multi});

      if (!multi) {
        writeEntries();
      }

      break;
    }
    case 'node': {
      buildNode({multi});
      break;
    }
    default: {
      buildBrowser({multi});
      buildNode({multi});

      if (!multi) {
        writeEntries();
      }
    }
  }
};
