import {isNullish} from '@dfinity/utils';
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

export const generateFunctions = async ({
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
  // @junobuild/functions replaces globalThis.console with a version that calls
  // __ic_cdk_print, which only exists in the WASM host environment. We stub it
  // so the import doesn't throw when the module is evaluated in Node.
  globalThis.__ic_cdk_print = (msg: string) => process.stdout.write(msg + '\n');

  // It might be needed
  // globalThis.__juno_satellite_random = () => {
  //   const buf = new Uint32Array(1);
  //   crypto.getRandomValues(buf);
  //   return buf[0];
  // };

  const devModule = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString(`base64`)}`
  );

  const {__JUNO_FUNCTION_TYPE, QuerySchema} = await import('@junobuild/functions');

  // TODO: no need to be exported?
  __JUNO_FUNCTION_TYPE;

  const queries = Object.entries(devModule).filter(([_key, value]) => {
    // const config = typeof value === 'function' ? value({}) : value;
    // return config?.type === __JUNO_FUNCTION_TYPE.QUERY;
    return QuerySchema.safeParse(value).success;
  });

  console.log('Queries ->', queries);
};

const writeDevScript = async ({
  code,
  outfileJs
}: Pick<GenerateBuildResultData, 'code'> & Pick<GenerateArgs, 'outfileJs'>) => {
  await writeFile(outfileJs, code);
};
