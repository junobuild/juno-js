export const tsTemplateImports = `import type {_SERVICE as SatelliteActor} from './satellite.did';
// @ts-expect-error - generated JS file without type declarations
import {idlFactory} from './satellite.factory.did.js';
import {getSatelliteExtendedActor} from '@junobuild/%CORE_LIB%';
import {schemaToIdl, schemaFromIdl} from '@junobuild/schema/utils';
import {j} from '@junobuild/schema';`;

export const tsTemplateWithArgsWithResult = `
%ARGS_ZOD%
%RESULT_ZOD%

const %JS_FUNCTION% = async (args: j.infer<typeof %ARGS_SCHEMA%>): Promise<j.infer<typeof %RESULT_SCHEMA%>> => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = schemaToIdl({schema: %ARGS_SCHEMA%, value: parsedArgs}) as Parameters<SatelliteActor['%RS_FUNCTION%']>[0];

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tconst idlResult = await %RS_FUNCTION%(idlArgs);

\tconst result = schemaFromIdl({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateWithArgsNoResult = `
%ARGS_ZOD%

const %JS_FUNCTION% = async (args: j.infer<typeof %ARGS_SCHEMA%>): Promise<void> => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = schemaToIdl({schema: %ARGS_SCHEMA%, value: parsedArgs}) as Parameters<SatelliteActor['%RS_FUNCTION%']>[0];

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tawait %RS_FUNCTION%(idlArgs);
};`;

export const tsTemplateNoArgsWithResult = `
%RESULT_ZOD%

const %JS_FUNCTION% = async (): Promise<j.infer<typeof %RESULT_SCHEMA%>> => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tconst idlResult = await %RS_FUNCTION%();

\tconst result = schemaFromIdl({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const tsTemplateNoArgsNoResult = `
const %JS_FUNCTION% = async (): Promise<void> => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
\tawait %RS_FUNCTION%();
};`;
