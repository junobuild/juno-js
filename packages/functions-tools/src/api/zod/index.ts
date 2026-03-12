import type {Query, Update} from '@junobuild/functions';
import {writeFile} from 'node:fs/promises';
import type {TransformerOptions} from '../types/transformer-options';
import {parseZodApi} from './services/parser.services';

export const generateZodApi = async ({
  functions,
  outputFile,
  transformerOptions
}: {
  functions: [string, Update | Query][];
  outputFile: string;
  transformerOptions: TransformerOptions;
}) => {
  const api = parseZodApi({
    functions,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
