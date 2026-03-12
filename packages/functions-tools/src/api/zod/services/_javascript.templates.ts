export const jsTemplateImports = `import {idlFactory} from './satellite.factory.did.js';
import {getSatelliteExtendedActor} from '@junobuild/%CORE_LIB%';
import {recursiveToNullable, recursiveFromNullable} from '@junobuild/zod';
import * as z from 'zod';`;

export const jsTemplateWithArgsWithResult = `
%ARGS_ZOD%
%RESULT_ZOD%

export const %JS_FUNCTION% = async (args) => {
  const parsedArgs = %ARGS_SCHEMA%.parse(args);
  const idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

  const {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
  const idlResult = await %RS_FUNCTION%(idlArgs);

  const result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
  return %RESULT_SCHEMA%.parse(result);
};`;

export const jsTemplateWithArgsNoResult = `
%ARGS_ZOD%

export const %JS_FUNCTION% = async (args) => {
  const parsedArgs = %ARGS_SCHEMA%.parse(args);
  const idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

  const {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
  await %RS_FUNCTION%(idlArgs);
};`;

export const jsTemplateNoArgsWithResult = `
%RESULT_ZOD%

export const %JS_FUNCTION% = async () => {
  const {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
  const idlResult = await %RS_FUNCTION%();

  const result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
  return %RESULT_SCHEMA%.parse(result);
};`;

export const jsTemplateNoArgsNoResult = `
export const %JS_FUNCTION% = async () => {
  const {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
  await %RS_FUNCTION%();
};`;
