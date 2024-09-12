import type {CompilerOptions, Node, SourceFile, TypeChecker} from 'typescript';
import {
  ModuleKind,
  ScriptTarget,
  createProgram,
  forEachChild,
  isFunctionDeclaration,
  isMethodDeclaration,
  isModuleDeclaration
} from 'typescript';
import {DocEntry} from './types/entry';

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
  buildFunctions({
    inputFile,
    compilerOptions
  });
};

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ES2020,
  module: ModuleKind.CommonJS,
  strictNullChecks: true
};

export const buildFunctions = ({
  inputFile,
  compilerOptions
}: {
  inputFile: string;
  compilerOptions?: CompilerOptions;
}): DocEntry[] => {
  // Build a program using the set of root file names in fileNames
  const program = createProgram([inputFile], compilerOptions ?? DEFAULT_COMPILER_OPTIONS);

  const [sourceFile] = program.getSourceFiles();

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const result: DocEntry[] = [];

  // Walk the tree to search for classes
  forEachChild(sourceFile, (node: Node) => {
    const entries = visit({checker, node, sourceFile});
    result.push(...entries);
  });

  return result;
};

/** visit nodes finding exported classes */
const visit = ({
  checker,
  node,
  ...rest
}: {
  checker: TypeChecker;
  node: Node;
  sourceFile: SourceFile;
}): DocEntry[] => {
  const entries: DocEntry[] = [];

  if (isModuleDeclaration(node)) {
    console.log('Module');
  } else if (isMethodDeclaration(node)) {
    console.log('Method');
  } else if (isFunctionDeclaration(node)) {
    console.log('Function');
  } else {
    console.log('Arrow');
  }

  return entries;
};
