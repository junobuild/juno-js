import {resolve} from 'path/posix';
import {
  CompilerOptions,
  Declaration,
  ModuleKind,
  Node,
  PropertyName,
  ScriptTarget,
  SourceFile,
  TypeChecker,
  TypeReference,
  Symbol as TypeScriptSymbol,
  createProgram,
  forEachChild,
  isArrowFunction,
  isInterfaceDeclaration,
  isMethodSignature,
  isPropertySignature
} from 'typescript';
import {DocEntry, DocEntryType} from './types/entry';

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
  console.log(inputFile);

  // Build a program using the set of root file names in fileNames
  const program = createProgram([inputFile], compilerOptions ?? DEFAULT_COMPILER_OPTIONS);

  const programSourceFiles = program.getSourceFiles();

  const filenamesFullPaths: string[] = [inputFile].map((fileName: string) => resolve(fileName));

  // Visit only the files specified by the developers - no deep visit
  const sourceFiles = programSourceFiles.filter(
    ({isDeclarationFile, fileName}) =>
      !isDeclarationFile && filenamesFullPaths.includes(resolve(fileName))
  );

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const result: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    // Walk the tree to search for classes
    forEachChild(sourceFile, (node: Node) => {
      const entries: DocEntry[] = visit({checker, node, sourceFile});
      result.push(...entries);
    });
  }

  return result;
};

/** Serialize a symbol into a json object */
const serializeSymbol = ({
  checker,
  symbol,
  doc_type
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
  doc_type?: DocEntryType;
}): DocEntry => {
  return {
    name: symbol.getName(),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)),
    ...(doc_type && {doc_type})
  };
};

// https://stackoverflow.com/a/73338964/5404186
const findDescendantArrowFunction = (node: Node): Node | undefined => {
  if (isArrowFunction(node)) {
    return node;
  }

  return forEachChild(node, findDescendantArrowFunction);
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

  if (isInterfaceDeclaration(node)) {
    const symbol = checker.getSymbolAtLocation(node.name);

    if (symbol) {
      const interfaceEntry: DocEntry = serializeSymbol({checker, doc_type: 'interface', symbol});

      if (interfaceEntry.name === '_SERVICE') {
        const members = node.members
          .filter((member) => isPropertySignature(member) || isMethodSignature(member))
          .map((member) => checker.getSymbolAtLocation(member.name as PropertyName))
          .filter((symbol) => symbol !== undefined)
          .map((symbol) => ({
            name: symbol?.getName(),
            type: checker.getTypeOfSymbolAtLocation(
              symbol as TypeScriptSymbol,
              (symbol as TypeScriptSymbol).valueDeclaration as Declaration
            )
          }))
          .filter(({name, type}) => name !== undefined && type.symbol.getName() === 'ActorMethod')
          .map(({type: member, name}) => {
            const paramType = checker.typeToString(
              checker.getTypeArguments(member as TypeReference)[0]
            );
            const returnType = checker.typeToString(
              checker.getTypeArguments(member as TypeReference)[1]
            );

            // Convert '[Hello, string]' to [ 'Hello', 'string' ] and '[]' to []
            const paramArray =
              paramType === '[]'
                ? []
                : paramType
                    .slice(1, -1)
                    .split(',')
                    .map((type) => type.trim());

            return {
              name,
              paramType: paramArray,
              returnType: returnType
            };
          });

        console.log(interfaceEntry);
        console.log(members);
      }
    }
  }

  return entries;
};
