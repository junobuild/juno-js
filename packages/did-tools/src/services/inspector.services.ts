import {isNullish} from '@junobuild/utils';
import {resolve} from 'path/posix';
import {
  ModuleKind,
  ScriptTarget,
  createProgram,
  forEachChild,
  isInterfaceDeclaration,
  isMethodSignature,
  isPropertySignature,
  type CompilerOptions,
  type Declaration,
  type InterfaceDeclaration,
  type Node,
  type PropertyName,
  type TypeChecker,
  type TypeReference,
  type Symbol as TypeScriptSymbol
} from 'typescript';
import type {MethodSignature} from '../types/method-signature';

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  target: ScriptTarget.ES2020,
  module: ModuleKind.CommonJS,
  strictNullChecks: true
};

export const collectMethodSignatures = ({
  inputFile,
  compilerOptions
}: {
  inputFile: string;
  compilerOptions?: CompilerOptions;
}): MethodSignature[] => {
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

  const result: MethodSignature[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of sourceFiles) {
    // Walk the tree to search for classes
    forEachChild(sourceFile, (node: Node) => {
      const entries = visit({checker, node});
      result.push(...entries);
    });
  }

  return result;
};

interface SymbolDetails {
  name: string;
  type?: string;
}

/** Serialize a symbol into a json object */
const serializeSymbol = ({
  checker,
  symbol
}: {
  checker: TypeChecker;
  symbol: TypeScriptSymbol;
}): SymbolDetails => {
  return {
    name: symbol.getName(),
    type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
  };
};

const membersToMethodSignatures = ({
  node,
  checker
}: {
  node: InterfaceDeclaration;
  checker: TypeChecker;
}): MethodSignature[] => {
  return node.members
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
      const paramType = checker.typeToString(checker.getTypeArguments(member as TypeReference)[0]);
      const returnType = checker.typeToString(checker.getTypeArguments(member as TypeReference)[1]);

      // Convert '[Hello, string]' to [ 'Hello', 'string' ] and '[]' to []
      const paramArray =
        paramType === '[]'
          ? []
          : paramType
              .slice(1, -1)
              .split(',')
              .map((type) => type.trim());

      const signature: MethodSignature = {
        name: name!,
        paramsType: paramArray,
        returnType: returnType
      };

      return signature;
    });
};

/** visit nodes finding exported classes */
const visit = ({checker, node}: {checker: TypeChecker; node: Node}): MethodSignature[] => {
  if (!isInterfaceDeclaration(node)) {
    return [];
  }

  const symbol = checker.getSymbolAtLocation(node.name);

  if (isNullish(symbol)) {
    return [];
  }

  const {name: interfaceName} = serializeSymbol({checker, symbol});

  if (interfaceName !== '_SERVICE') {
    return [];
  }

  return membersToMethodSignatures({node, checker});
};
