import esbuild from 'esbuild';
import {readdirSync, statSync} from 'fs';
import {join} from 'path';
import {DIST} from './utils.mjs';

export const buildWebWorkers = () => {
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
      outdir: join(DIST, 'workers'),
      bundle: true,
      sourcemap: 'external',
      minify: true,
      target: ['node18']
    })
    .catch(() => process.exit(1));
};
