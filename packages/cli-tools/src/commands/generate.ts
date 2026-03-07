import {isNullish} from '@dfinity/utils';
import {generateFunctions} from '@junobuild/did-tools';
import type {Metafile} from 'esbuild';
import {writeFile} from 'node:fs/promises';
import {buildFunctions} from './build';

export interface GenerateArgs {
  infile: string;
  outfileJs: string;
  outfileRs: string;
  banner?: {[type: string]: string};
}

export interface GenerateResultData {
  version: string;
  output: [string, Metafile['outputs'][0]];
}

type GenerateBuildResultData = GenerateResultData & {code: Uint8Array};

export interface GenerateResultError {
  status: 'error';
  warnings?: string[];
  errors: string[];
}

export type GenerateResult = {status: 'success'; result: GenerateResultData} | GenerateResultError;

export type GenerateCodeResult =
  | {status: 'success'; result: GenerateBuildResultData}
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
  await writeDevFunctions({code, outfileRs});

  await writeDevScript({code, outfileJs});

  return {status: 'success', result: buildResult};
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
}: Pick<GenerateBuildResultData, 'code'> & Pick<GenerateArgs, 'outfileRs'>) => {
  await generateFunctions({code, outputFile: outfileRs});
};

const writeDevScript = async ({
  code,
  outfileJs
}: Pick<GenerateBuildResultData, 'code'> & Pick<GenerateArgs, 'outfileJs'>) => {
  await writeFile(outfileJs, code);
};
