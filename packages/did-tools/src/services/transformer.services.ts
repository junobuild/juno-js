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

\treturn await %DID_METHOD_NAME%(%CALL_PARAMS%);
}`;

const methodTemplateJavaScript = `export const %METHOD_NAME% = async (%CALL_PARAMS%) => {
\tconst {%DID_METHOD_NAME%} = await getSatelliteExtendedActor({
\t\tidlFactory
\t});

\treturn await %DID_METHOD_NAME%(%CALL_PARAMS%);
}`;

export const generateService = ({
  signatures,
  transformerOptions: {coreLib, outputLanguage}
}: {
  signatures: MethodSignature[];
  transformerOptions: TransformerOptions;
}): string => {
  const langTemplate =
    outputLanguage === 'js' ? methodTemplateJavaScript : methodTemplateTypeScript;

  const methods = signatures
    .map((signature) => {
      const replacers = mapSignature(signature);

      let result = langTemplate;
      Object.entries(replacers).map(([key, value]) => {
        result = result.replaceAll(`%${key}%`, value);
      });

      return result;
    })
    .join('\n\n');

  return template
    .replace('%CORE_LIB%', coreLib ?? 'core')
    .replace('%METHODS%', methods)
    .trim();
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
  CALL_PARAMS: string;
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
    CALL_PARAMS: paramKeysText
  };
};
