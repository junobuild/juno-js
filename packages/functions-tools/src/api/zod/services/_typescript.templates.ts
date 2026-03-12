export const tsTemplateImports = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import {getSatelliteExtendedActor} from '@junobuild/%CORE_LIB%';
import {recursiveToNullable, recursiveFromNullable} from '@junobuild/zod';
import * as z from 'zod';`;

export const tsTemplateWithArgsWithResult = `
%ARGS_ZOD%
%RESULT_ZOD%

const %JS_FUNCTION% = async (args: z.infer<typeof %ARGS_SCHEMA%>): Promise<z.infer<typeof %RESULT_SCHEMA%>> => {
  const parsedArgs = %ARGS_SCHEMA%.parse(args);
  const idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

  const {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  const idlResult = await %RS_FUNCTION%(idlArgs);

  const result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
  return %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateWithArgsNoResult = `
%ARGS_ZOD%

const %JS_FUNCTION% = async (args: z.infer<typeof %ARGS_SCHEMA%>): Promise<void> => {
  const parsedArgs = %ARGS_SCHEMA%.parse(args);
  const idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

  const {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  await %RS_FUNCTION%(idlArgs);
};`;

export const tsTemplateNoArgsWithResult = `
%RESULT_ZOD%

const %JS_FUNCTION% = async (): Promise<z.infer<typeof %RESULT_SCHEMA%>> => {
  const {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  const idlResult = await %RS_FUNCTION%();

  const result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
  return %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateNoArgsNoResult = `
const %JS_FUNCTION% = async (): Promise<void> => {
  const {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  await %RS_FUNCTION%();
};`;
