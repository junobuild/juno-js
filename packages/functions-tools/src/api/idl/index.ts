import {writeFile} from 'node:fs/promises';
import type {TransformerOptions} from '../types/transformer-options';
import {collectApi} from './services/inspector.services';
import {parseApi} from './services/parser.services';

export const generateIdlApi = async ({
  inputFile,
  outputFile,
  transformerOptions
}: {
  inputFile: string;
  outputFile: string;
  transformerOptions: TransformerOptions;
}) => {
  const definition = await collectApi({
    inputFile
  });

  const api = parseApi({
    ...definition,
    transformerOptions
  });

  await writeFile(outputFile, api, 'utf-8');
};
