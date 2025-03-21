import type {Message, Metafile} from 'esbuild';
import {rm} from 'node:fs/promises';

export const buildEsm = async ({
  infile,
  outfile
}: {
  infile: string;
  outfile: string;
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
    minify: true,
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
    metafile: true
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
