import type {Message, Metafile} from 'esbuild';
import {rm} from 'node:fs/promises';

/**
 * Builds an ECMAScript module (ESM) bundle for browser use using `esbuild`.
 *
 * This function:
 * - Ensures `esbuild` is available.
 * - Deletes the existing output file if it exists.
 * - Builds the input file with optimizations: minification, tree-shaking, etc.
 * - Returns the esbuild `metafile`, version, and any build errors or warnings.
 *
 * @param {Object} options - Build configuration.
 * @param {string} options.infile - The path to the input file to be bundled.
 * @param {string} options.outfile - The path where the output bundle should be written.
 * @param {Object<string, string>} [options.banner] - Optional banner to prepend to the generated file.
 * @param {boolean} [options.minify=true] - Whether to minify the bundle. Defaults to `true`.
 * @param {boolean} [options.keepNames=true] - Whether to preserve function and class names. Defaults to `true`.
 *
 * @returns {Promise<{
 *   metafile: Metafile,
 *   errors: Message[],
 *   warnings: Message[],
 *   version: string
 * }>} An object containing the esbuild metafile, build errors/warnings, and the version of esbuild used.
 *
 * @throws Will exit the process if `esbuild` is not installed.
 */
export const buildEsm = async ({
  infile,
  outfile,
  banner,
  minify = true,
  keepNames = true
}: {
  infile: string;
  outfile: string;
  banner?: {[type: string]: string};
  minify?: boolean;
  keepNames?: boolean;
}): Promise<{
  metafile: Metafile;
  errors: Message[];
  warnings: Message[];
  version: string;
}> => {
  await assertEsbuild();

  const {build, version} = await import('esbuild');

  await rm(outfile, {force: true});

  const {metafile, errors, warnings} = await build({
    entryPoints: [infile],
    outfile,
    bundle: true,
    minify,
    keepNames,
    treeShaking: true,
    format: 'esm',
    platform: 'browser',
    write: true,
    supported: {
      'top-level-await': false,
      'inline-script': false
    },
    define: {
      self: 'globalThis'
    },
    metafile: true,
    banner
  });

  return {metafile, errors, warnings, version};
};

const assertEsbuild = async () => {
  try {
    await import('esbuild');
  } catch (_err: unknown) {
    console.error(
      `Esbuild is required to build your functions. Please install it by running: npm i esbuild`
    );
    process.exit(1);
  }
};
