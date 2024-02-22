#!/usr/bin/env node

import {NodeModulesPolyfillPlugin} from '@esbuild-plugins/node-modules-polyfill';
import esbuild from 'esbuild';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'fs';
import {join} from 'path';

const dist = join(process.cwd(), 'dist');

const createDistFolder = () => {
  if (!existsSync(dist)) {
    mkdirSync(dist);
  }
};

// Skip peer dependencies
const peerDependencies = (packageJson) => {
  const json = readFileSync(packageJson, 'utf8');
  const {peerDependencies} = JSON.parse(json);
  return peerDependencies ?? {};
};

const workspacePeerDependencies = peerDependencies(join(process.cwd(), 'package.json'));

const entryPoints = readdirSync(join(process.cwd(), 'src'))
  .filter(
    (file) =>
      !file.includes('test') &&
      !file.includes('spec') &&
      !file.endsWith('.swp') &&
      statSync(join(process.cwd(), 'src', file)).isFile()
  )
  .map((file) => `src/${file}`);

const buildBrowser = () => {
  // esm output bundles with code splitting
  esbuild
    .build({
      entryPoints,
      outdir: 'dist/browser',
      bundle: true,
      sourcemap: true,
      minify: true,
      splitting: true,
      format: 'esm',
      target: ['esnext'],
      platform: 'browser',
      conditions: ['worker', 'browser'],
      plugins: [NodeModulesPolyfillPlugin()],
      external: [...Object.keys(workspacePeerDependencies)]
    })
    .catch(() => process.exit(1));

  // esm output bundle for Node
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/node/index.mjs',
      bundle: true,
      sourcemap: true,
      minify: true,
      format: 'esm',
      platform: 'node',
      target: ['node18', 'esnext'],
      banner: {
        js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
      },
      external: [...Object.keys(workspacePeerDependencies)]
    })
    .catch(() => process.exit(1));
};

const buildNode = () => {
  // esm output bundle for Node
  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outfile: 'dist/node/index.mjs',
      bundle: true,
      sourcemap: true,
      minify: true,
      format: 'esm',
      platform: 'node',
      target: ['node18', 'esnext'],
      banner: {
        js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
      },
      external: [...Object.keys(workspacePeerDependencies)]
    })
    .catch(() => process.exit(1));
};

const writeEntries = () => {
  // an entry for the browser as default
  writeFileSync(join(dist, 'index.js'), "export * from './browser/index.js';");
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
