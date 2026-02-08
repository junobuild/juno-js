import {existsSync, mkdirSync, readdirSync, statSync, writeFileSync} from 'fs';
import {join} from 'path';
import {workspaceExports} from './pkg.mjs';

export const DIST = join(process.cwd(), 'dist');

export const createDistFolder = () => {
  if (!existsSync(DIST)) {
    mkdirSync(DIST);
  }
};

export const writeEntries = () => {
  // an entry for the browser as default
  writeFileSync(join(DIST, 'index.js'), "export * from './browser/index.js';");
};

export const collectEntryPoints = () => {
  return readdirSync(join(process.cwd(), 'src'))
    .filter(
      (file) =>
        !file.includes('test') &&
        !file.includes('spec') &&
        !file.includes('mock') &&
        !file.endsWith('.swp') &&
        !file.endsWith('.worker.ts') &&
        statSync(join(process.cwd(), 'src', file)).isFile()
    )
    .map((file) => `src/${file}`);
};

/**
 * When building a subpath-only library, the files to bundle are determined
 * based on the `exports` field in the package.json, which defines what the consumer
 * can access and which bundled files are exposed.
 *
 * It is assumed that the corresponding TypeScript source files share the same
 * names as their related JavaScript output files, which is accurate since
 * esbuild preserves file names when generating outputs.
 *
 * @returns {string[]} Absolute paths to the TypeScript source files to bundle.
 */
export const collectMultiPathsLibEntryPoints = () => {
  const paths = Object.values(workspaceExports)
    // This guard is useful because a single-entry library uses an object
    // for the "import" field, unlike a multi-path library, which uses
    // a string path.
    .filter(({import: i}) => typeof i === 'string')
    .map(({import: i}) => {
      // trim leading ./ otherwise join() treat the . as a folder
      // replace extension js from its corresponding ts file
      const file = i.replace(/^\.\//, '').replace(/\.js$/, '.ts');
      return join(process.cwd(), 'src', file);
    });

  if (paths.length === 0) {
    console.error('No source files to bundle.');
    process.exit(1);
  }

  const unknownPaths = paths.filter((path) => !existsSync(path));

  if (unknownPaths.length > 0) {
    console.error(`Some source files are missing: ${unknownPaths.join(',')}`);
    process.exit(1);
  }

  return paths;
};
