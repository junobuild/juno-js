import {writeFile} from 'node:fs/promises';
import {collectMethodSignatures} from './services/inspector.services';
import {parseApi} from './services/parser.services';
import type {TransformerOptions} from './types/transformer-options';

export type * from './types/transformer-options';

export const generateApi = async ({
  inputFile,
  outputFile,
  transformerOptions
}: {
  inputFile: string;
  outputFile: string;
  transformerOptions: TransformerOptions;
}) => {
  const signatures = await collectMethodSignatures({
    inputFile
  });

  const api = parseApi({
    signatures,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
