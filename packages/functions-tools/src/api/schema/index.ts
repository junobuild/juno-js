import type {Query, Update} from '@junobuild/functions';
import {writeFile} from 'node:fs/promises';
import type {TransformerOptions} from '../types/transformer-options';
import {parseSchemaApi} from './services/parser.services';

export const generateSchemaApi = async ({
  functions,
  outputFile,
  transformerOptions
}: {
  functions: [string, Update | Query][];
  outputFile: string;
  transformerOptions: TransformerOptions;
}) => {
  const api = parseSchemaApi({
    functions,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
