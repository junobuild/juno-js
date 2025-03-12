import esbuild from 'esbuild';
import {join} from 'path';
import {createDistFolder, DIST, writeEntries} from './esbuild-utils.mjs';

export const buildFunctions = () => {
  createDistFolder();

  esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outdir: join(DIST, 'browser'),
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
      }
    })
    .catch(() => process.exit(1));
};

writeEntries();
