import type {ParserOptions} from '@babel/parser';
import * as babelParser from '@babel/parser';
import traverse from "@babel/traverse";
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

  console.log('------------------------------->', '000000');

  const ast = parse(fileContent, BABEL_PARSER_OPTIONS);

  const result: MethodSignature[] = [];

  console.log('------------------------------->', '111111', traverse);

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

  console.log('------------------------------->', '2');

  if (isNullish(typeAnnotation)) {
    return 'unknown';
  }

  console.log('------------------------------->', '3');

  if (isTSTypeReference(typeAnnotation)) {
    const typeName = (typeAnnotation.typeName as Identifier)?.name;
    return typeName ?? 'unknown';
  }

  console.log('------------------------------->', '4');

  if (isTSStringKeyword(typeAnnotation)) {
    return 'string';
  }

  console.log('------------------------------->', '5');

  if (isTSNumberKeyword(typeAnnotation)) {
    return 'number';
  }

  console.log('------------------------------->', '6');

  if (isTSBooleanKeyword(typeAnnotation)) {
    return 'boolean';
  }

  console.log('------------------------------->', '7');

  if (isTSBigIntKeyword(typeAnnotation)) {
    return 'bigint';
  }

  console.log('------------------------------->', '8');

  if (isTSSymbolKeyword(typeAnnotation)) {
    return 'symbol';
  }

  console.log('------------------------------->', '9');

  if (isTSNullKeyword(typeAnnotation)) {
    return 'null';
  }

  console.log('------------------------------->', '10');

  if (isTSUndefinedKeyword(typeAnnotation)) {
    return 'undefined';
  }

  console.log('------------------------------->', '11');

  if (isTSVoidKeyword(typeAnnotation)) {
    return 'void';
  }

  console.log('------------------------------->', '12');

  if (isTSNeverKeyword(typeAnnotation)) {
    return 'never';
  }

  console.log('------------------------------->', '13');

  if (isTSUnknownKeyword(typeAnnotation)) {
    return 'unknown';
  }

  console.log('------------------------------->', '14');

  if (isTSAnyKeyword(typeAnnotation)) {
    return 'any';
  }

  console.log('------------------------------->', '15');

  if (isTSObjectKeyword(typeAnnotation)) {
    return 'object';
  }

  console.log('------------------------------->', '16');

  if (isTSTupleType(typeAnnotation)) {
    const tupleTypes = typeAnnotation.elementTypes.map(getTypeName);
    return `[${tupleTypes.join(', ')}]`;
  }

  console.log('------------------------------->', '17');

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
