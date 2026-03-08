import {isNullish} from '@dfinity/utils';
import {generateFunctions, type GenerateFunctionsResult} from '@junobuild/did-tools';
import type {Metafile} from 'esbuild';
import {writeFile} from 'node:fs/promises';
import {relative} from 'node:path';
import {buildFunctions} from './build';

export interface GenerateArgs {
  infile: string;
  outfileJs: string;
  outfileRs: string;
  banner?: {[type: string]: string};
}

export interface GenerateBuildData {
  version: string;
  output: [string, Metafile['outputs'][0]];
  code: Uint8Array;
  outputPath: string;
}

export interface GenerateResultData {
  build: Omit<GenerateBuildData, 'code'>;
  generate: GenerateFunctionsResult;
}

export interface GenerateResultError {
  status: 'error';
  warnings?: string[];
  errors: string[];
}

export type GenerateResult = {status: 'success'; result: GenerateResultData} | GenerateResultError;

export type GenerateCodeResult =
  | {status: 'success'; result: Omit<GenerateBuildData, 'outputPath'>}
  | GenerateResultError;

export const buildAndGenerateFunctions = async ({
  outfileJs,
  outfileRs,
  ...args
}: GenerateArgs): Promise<GenerateResult> => {
  const build = await buildWithEsbuild(args);

  if (build.status === 'error') {
    return build;
  }

  const {
    result: {code, ...buildResult}
  } = build;

  // We generate the custom functions before the JavaScript script because
  // there might be none, therefore no Rust module to generate but, also because
  // the Docker image currently watches the script to initiate new automatic build.
  const generate = await writeDevFunctions({code, outfileRs});

  const dev = await writeDevScript({code, outfileJs});

  return {status: 'success', result: {build: {...buildResult, ...dev}, generate}};
};

const buildWithEsbuild = async ({
  infile,
  banner
}: Omit<GenerateArgs, 'outfileJs' | 'outfileRs'>): Promise<GenerateCodeResult> => {
  const {
    metafile,
    errors: buildErrors,
    warnings: buildWarnings,
    version,
    outputFiles
  } = await buildFunctions({
    infile,
    banner
  });

  const warnings = buildWarnings.map(({text}) => text);
  const errors = buildErrors.map(({text}) => text);

  if (errors.length > 0) {
    return {status: 'error', errors, warnings};
  }

  const entry = Object.entries(metafile.outputs);

  if (entry.length === 0) {
    return {
      status: 'error',
      errors: ['Unexpected: No metafile resulting from the build was found.']
    };
  }

  const code = outputFiles?.[0]?.contents;

  if (isNullish(code)) {
    return {
      status: 'error',
      errors: ['Unexpected: No script build for the functions.']
    };
  }

  return {
    status: 'success',
    result: {
      output: entry[0],
      version,
      code
    }
  };
};

const writeDevFunctions = async ({
  code,
  outfileRs
}: Pick<GenerateBuildData, 'code'> &
  Pick<GenerateArgs, 'outfileRs'>): Promise<GenerateFunctionsResult> =>
  await generateFunctions({code, outputFile: outfileRs});

const writeDevScript = async ({
  code,
  outfileJs
}: Pick<GenerateBuildData, 'code'> & Pick<GenerateArgs, 'outfileJs'>): Promise<{
  outputPath: string;
}> => {
  await writeFile(outfileJs, code);

  return {
    outputPath: relative(process.cwd(), outfileJs)
  };
};
