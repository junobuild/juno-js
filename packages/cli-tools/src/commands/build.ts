export const buildEsm = async ({
  infile,
  outfile
}: {
  infile: string;
  outfile: string;
}): Promise<void> => {
  await assertEsbuild();

  const {build} = await import('esbuild');

  await build({
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
    }
  });
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
