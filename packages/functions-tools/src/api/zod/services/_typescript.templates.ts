export const tsTemplateImports = `import type {_SERVICE as SatelliteActor} from './satellite.did';
import {idlFactory} from './satellite.factory.did.js';
import {getSatelliteExtendedActor} from '@junobuild/%CORE_LIB%';
import {recursiveToNullable, recursiveFromNullable} from '@junobuild/zod';
import * as z from 'zod';`;

export const tsTemplateWithArgsWithResult = `
%ARGS_ZOD%
%RESULT_ZOD%

const %JS_FUNCTION% = async (args: z.infer<typeof %ARGS_SCHEMA%>): Promise<z.infer<typeof %RESULT_SCHEMA%>> => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tconst idlResult = await %RS_FUNCTION%(idlArgs);

\tconst result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateWithArgsNoResult = `
%ARGS_ZOD%

const %JS_FUNCTION% = async (args: z.infer<typeof %ARGS_SCHEMA%>): Promise<void> => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = recursiveToNullable({schema: %ARGS_SCHEMA%, value: parsedArgs});

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tawait %RS_FUNCTION%(idlArgs);
};`;

export const tsTemplateNoArgsWithResult = `
%RESULT_ZOD%

const %JS_FUNCTION% = async (): Promise<z.infer<typeof %RESULT_SCHEMA%>> => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tconst idlResult = await %RS_FUNCTION%();

\tconst result = recursiveFromNullable({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateNoArgsNoResult = `
const %JS_FUNCTION% = async (): Promise<void> => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tawait %RS_FUNCTION%();
};`;
