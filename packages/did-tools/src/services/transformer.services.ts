import {MethodSignature} from '../types/method-signature';
import {TransformerOptions} from '../types/transformer-options';

const template = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import { getSatelliteExtendedActor } from '@junobuild/%CORE_LIB%';

%METHODS%
`;

const methodTemplateTypeScript = `export const %METHOD_NAME% = async (%PARAMS%): Promise<%METHOD_RESULT%> => {
\tconst {%DID_METHOD_NAME%} = await getSatelliteExtendedActor<SatelliteActor>({
\t\tidlFactory
\t});

\treturn await %DID_METHOD_NAME%(%DID_PARAMS%);
}`;

export const generateService = ({
  signatures,
  transformerOptions: {coreLib}
}: {
  signatures: MethodSignature[];
  transformerOptions: TransformerOptions;
}): string => {
  const methods = signatures
    .map((signature) => {
      const replacers = mapSignature(signature);

      let result = methodTemplateTypeScript;
      Object.entries(replacers).map(([key, value]) => {
        result = result.replaceAll(`%${key}%`, value);
      });

      return result;
    })
    .join('\n\n');

  return template.replace('%CORE_LIB%', coreLib ?? 'core').replace('%METHODS%', methods).trim();
};

const mapSignature = ({
  name,
  returnType,
  paramsType
}: MethodSignature): {
  METHOD_NAME: string;
  DID_METHOD_NAME: string;
  METHOD_RESULT: string;
  PARAMS: string;
  DID_PARAMS: string;
} => {
  const camelize = (s: string): string => s.replace(/-./g, (x) => x[1].toUpperCase());

  const methodName = camelize(name);

  const params = paramsType.map((paramType, i) => ({
    param: `value${i}`,
    type: paramType
  }));

  const paramKeysText = `${params.map(({param}) => param).join(', ')}`;

  const paramsText = params.map(({param, type}) => `${param}: ${type}`).join(', ');

  return {
    METHOD_NAME: methodName,
    DID_METHOD_NAME: name,
    METHOD_RESULT: returnType,
    PARAMS: paramsText,
    DID_PARAMS: paramKeysText
  };
};
