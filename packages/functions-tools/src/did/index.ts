import type {Query, Update} from '@junobuild/functions';
import {writeFile} from 'node:fs/promises';
import {parseDidApi} from './services/parser.services';

export const generateDid = async ({
  updates,
  queries,
  outputFile
}: {
  updates: [string, Update][];
  queries: [string, Query][];
  outputFile: string;
}) => {
  const api = parseDidApi({
    queries,
    updates
  });

  await writeFile(outputFile, api, 'utf-8');
};
