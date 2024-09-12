import {writeFile} from 'node:fs/promises';
import type {CompilerOptions} from 'typescript';
import {collectMethodSignatures} from './services/inspector.services';
import {generateService} from './services/transformer.services';
import type {TransformerOptions} from './types/transformer-options';

export type * from './types/transformer-options';

export const generate = async ({
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

  const service = generateService({
    signatures,
    transformerOptions
  });

  await writeFile(outputFile, service, 'utf-8');
};
