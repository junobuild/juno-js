import {CompilerOptions} from 'typescript';
import {collectMethodSignatures} from './services/inspector.services';

export const generate = ({
  inputFile,
  outputFile,
  compilerOptions,
  outputLanguage
}: {
  inputFile: string;
  outputFile: string;
  compilerOptions?: CompilerOptions;
  outputLanguage: 'js' | 'ts';
}) => {
  const signatures = collectMethodSignatures({
    inputFile,
    compilerOptions
  });


};
