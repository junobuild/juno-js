import {nonNullish} from '@dfinity/utils';
import type {Message, Metafile, OutputFile} from 'esbuild';
import {rm} from 'node:fs/promises';

/**
 * Builds the serverless functions using `esbuild`.
 *
 * This feature:
 * - Ensures `esbuild` is available.
 * - Deletes the existing output file if it exists.
 * - Builds the input file with optimizations: minification, tree-shaking, etc.
 * - Returns the esbuild `metafile`, version, and any build errors or warnings.
 *
 * @param {Object} options - Build configuration.
 * @param {string} options.infile - The path to the input file to be bundled.
 * @param {string} options.outfile - The path where the output bundle should be written.
 * @param {Object<string, string>} [options.banner] - Optional banner to prepend to the generated file.
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
export const buildFunctions = async ({
  infile,
  outfile,
  banner
}: {
  infile: string;
  outfile: string;
  banner?: {[type: string]: string};
}): Promise<Omit<EsbuildResult, 'outputFiles'>> => {
  const {outputFiles: _, ...rest} = await esbuild({
    infile,
    outfile,
    platform: 'browser',
    treeShaking: true,
    define: {
      self: 'globalThis'
    },
    banner
  });

  return rest;
};

/**
 * Builds a script using `esbuild` for `juno run`.
 *
 * This feature:
 * - Ensures `esbuild` is available.
 * - Builds the input file for Node with optimizations: minification, tree-shaking, etc.
 * - Returns the esbuild output files, `metafile`, version, and any build errors or warnings.
 *
 * @param {Object} options - Build configuration.
 * @param {string} options.infile - The path to the input file to be bundled.
 *
 * @returns {Promise<{
 *   metafile: Metafile,
 *   errors: Message[],
 *   warnings: Message[],
 *   version: string,
 *   outputFiles: OutputFile[] | undefined;
 * }>} An object containing the esbuild outputFiles, metafile, build errors/warnings, and the version of esbuild used.
 *
 * @throws Will exit the process if `esbuild` is not installed.
 */
export const buildScript = async ({infile}: {infile: string}): Promise<EsbuildResult> =>
  await esbuild({
    infile,
    platform: 'node',
    treeShaking: false,
    banner: {
      js: `import { createRequire as topLevelCreateRequire } from 'node:module';
import { resolve } from 'node:path';
const require = topLevelCreateRequire(resolve(process.cwd(), '.juno-pseudo-require-anchor.mjs'));`
    }
  });

export interface EsbuildResult {
  metafile: Metafile;
  errors: Message[];
  warnings: Message[];
  version: string;
  outputFiles: OutputFile[] | undefined;
}

const esbuild = async ({
  infile,
  outfile,
  banner,
  platform,
  define,
  treeShaking
}: {
  infile: string;
  outfile?: string;
  banner?: {[type: string]: string};
  platform: 'browser' | 'node';
  define?: {[key: string]: string};
  treeShaking: boolean;
}): Promise<EsbuildResult> => {
  const {build, version} = await importEsbuildAndExitOnError();

  if (nonNullish(outfile)) {
    await rm(outfile, {force: true});
  }

  const {metafile, errors, warnings, outputFiles} = await build({
    entryPoints: [infile],
    outfile,
    write: nonNullish(outfile),
    bundle: true,
    minify: true,
    treeShaking,
    format: 'esm',
    platform,
    supported: {
      'top-level-await': false,
      'inline-script': false
    },
    external: ["esbuild"],
    define,
    metafile: true,
    banner
  });

  return {metafile, errors, warnings, outputFiles, version};
};

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const importEsbuildAndExitOnError = (): Promise<typeof import('esbuild')> => {
  try {
    return import('esbuild');
  } catch (_err: unknown) {
    console.error(
      `Esbuild is required to build your functions. Please install it by running: npm i esbuild`
    );
    process.exit(1);
  }
};
