import type {ParserOptions} from '@babel/parser';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';
import * as babelTypes from '@babel/types';
import {
  type Identifier,
  type TSMethodSignature,
  type TSNamedTupleMember,
  type TSPropertySignature,
  type TSType
} from '@babel/types';
import {isNullish, nonNullish} from '@junobuild/utils';
import {readFile} from 'node:fs/promises';
import {MethodSignature} from '../types/method-signature';

const {parse} = babelParser;
const {
  isTSAnyKeyword,
  isTSArrayType,
  isTSBigIntKeyword,
  isTSBooleanKeyword,
  isTSNeverKeyword,
  isTSNullKeyword,
  isTSNumberKeyword,
  isTSObjectKeyword,
  isTSStringKeyword,
  isTSSymbolKeyword,
  isTSTupleType,
  isTSTypeReference,
  isTSUndefinedKeyword,
  isTSUnknownKeyword,
  isTSVoidKeyword
} = babelTypes;

const BABEL_PARSER_OPTIONS: ParserOptions = {
  sourceType: 'module',
  plugins: ['typescript']
};

export const collectMethodSignatures = async ({
  inputFile
}: {
  inputFile: string;
}): Promise<MethodSignature[]> => {
  const fileContent = await readFile(inputFile, 'utf-8');

  const ast = parse(fileContent, BABEL_PARSER_OPTIONS);

  const result: MethodSignature[] = [];

  traverse(ast, {
    TSInterfaceDeclaration(path) {
      if (path.node.id.name === '_SERVICE') {
        const members = path.node.body.body;

        for (const member of members) {
          if (member.type === 'TSMethodSignature' || member.type === 'TSPropertySignature') {
            const methodSignature = membersToMethodSignatures(member);

            if (nonNullish(methodSignature)) {
              result.push(methodSignature);
            }
          }
        }
      }
    }
  });

  return result;
};

const getTypeName = (
  typeAnnotation: TSType | TSNamedTupleMember | undefined
): string | 'unknown' => {
  if (isNullish(typeAnnotation)) {
    return 'unknown';
  }

  if (isTSTypeReference(typeAnnotation)) {
    const typeName = (typeAnnotation.typeName as Identifier)?.name;
    return typeName ?? 'unknown';
  }

  if (isTSStringKeyword(typeAnnotation)) {
    return 'string';
  }

  if (isTSNumberKeyword(typeAnnotation)) {
    return 'number';
  }

  if (isTSBooleanKeyword(typeAnnotation)) {
    return 'boolean';
  }

  if (isTSBigIntKeyword(typeAnnotation)) {
    return 'bigint';
  }

  if (isTSSymbolKeyword(typeAnnotation)) {
    return 'symbol';
  }

  if (isTSNullKeyword(typeAnnotation)) {
    return 'null';
  }

  if (isTSUndefinedKeyword(typeAnnotation)) {
    return 'undefined';
  }

  if (isTSVoidKeyword(typeAnnotation)) {
    return 'void';
  }

  if (isTSNeverKeyword(typeAnnotation)) {
    return 'never';
  }

  if (isTSUnknownKeyword(typeAnnotation)) {
    return 'unknown';
  }

  if (isTSAnyKeyword(typeAnnotation)) {
    return 'any';
  }

  if (isTSObjectKeyword(typeAnnotation)) {
    return 'object';
  }

  if (isTSTupleType(typeAnnotation)) {
    const tupleTypes = typeAnnotation.elementTypes.map(getTypeName);
    return `[${tupleTypes.join(', ')}]`;
  }

  if (isTSArrayType(typeAnnotation)) {
    return getTypeName(typeAnnotation.elementType) + '[]';
  }

  return 'unknown';
};

const membersToMethodSignatures = (
  member: TSMethodSignature | TSPropertySignature
): MethodSignature | undefined => {
  const {type, key} = member;

  const name = (key as Identifier | undefined)?.name;

  if (isNullish(name)) {
    return undefined;
  }

  if (type !== 'TSPropertySignature') {
    return undefined;
  }

  const typeAnnotation = member.typeAnnotation?.typeAnnotation;

  if (!isTSTypeReference(typeAnnotation)) {
    return undefined;
  }

  const typeName = (typeAnnotation.typeName as Identifier)?.name;

  if (typeName !== 'ActorMethod' || isNullish(typeAnnotation.typeParameters)) {
    return undefined;
  }

  const [paramType, returnType] = typeAnnotation.typeParameters.params;

  const paramsType = isTSTupleType(paramType)
    ? paramType.elementTypes.map(getTypeName)
    : [getTypeName(paramType)];

  return {
    name,
    paramsType,
    returnType: getTypeName(returnType)
  };
};
