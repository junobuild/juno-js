import {CompilerOptions} from 'typescript';
import {collectMethodSignatures} from './services/inspector.services';
import {TransformerOptions} from './types/transformer-options';

export const generate = ({
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
};
