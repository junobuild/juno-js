import {writeFile} from 'node:fs/promises';
import type {CompilerOptions} from 'typescript';
import {collectMethodSignatures} from './services/inspector.services';
import {parseApi} from './services/parser.services';
import type {TransformerOptions} from './types/transformer-options';

export type * from './types/transformer-options';

export const generateApi = async ({
  inputFile,
  outputFile,
  compilerOptions,
  transformerOptions
}: {
  inputFile: string;
  outputFile: string;
  compilerOptions?: CompilerOptions;
  transformerOptions: TransformerOptions;
}) => {
  const signatures = collectMethodSignatures({
    inputFile,
    compilerOptions
  });

  const api = parseApi({
    signatures,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
