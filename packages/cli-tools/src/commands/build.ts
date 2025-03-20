import {transformAsync} from '@babel/core';
import {assertNonNullish} from '@dfinity/utils';
import {readFile, writeFile} from 'node:fs/promises';
import {basename} from 'node:path';

export const buildForSputnik = async ({
  sourcePath,
  outputPath
}: {
  sourcePath: string;
  outputPath: string;
}): Promise<void> => {
  const code = await readFile(sourcePath, 'utf-8');

  const filename = basename(sourcePath);

  const result = await transformAsync(code, {
    presets: [
      ['@babel/preset-typescript'],
      ['@babel/preset-env', {targets: {esmodules: true}, modules: false}]
    ],
    plugins: [
      ['@babel/plugin-syntax-top-level-await', {disallow: true}],
      ['@babel/plugin-syntax-import-meta', {disallow: true}]
    ],
    filename,
    sourceMaps: false,
    compact: true,
    minified: true,
    configFile: false,
    babelrc: false,
    comments: false
  });

  assertNonNullish(result, `⚠️ Error bundling ${filename}.`);

  const {code: output} = result;

  assertNonNullish(output, `⚠️ Error ${filename} generated an empty module.`);

  await writeFile(outputPath, output, 'utf-8');
};
