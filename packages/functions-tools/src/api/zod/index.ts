import type {Query, Update} from '@junobuild/functions';
import {writeFile} from 'node:fs/promises';
import type {TransformerOptions} from '../types/transformer-options';
import {parseZodApi} from './services/parser.services';

export const generateZodApi = async ({
  queries,
  updates,
  outputFile,
  transformerOptions
}: {
  queries: [string, Query][];
  updates: [string, Update][];
  outputFile: string;
  transformerOptions: TransformerOptions;
}) => {
  const api = parseZodApi({
    queries,
    updates,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
