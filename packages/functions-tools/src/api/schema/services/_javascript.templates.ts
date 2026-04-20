export const jsTemplateImports = `import {idlFactory} from './satellite.factory.did.js';
import {getSatelliteExtendedActor} from '@junobuild/%CORE_LIB%';
import {schemaToIdl, schemaFromIdl} from '@junobuild/schema/utils';
import {j} from '@junobuild/schema';`;

export const jsTemplateWithArgsWithResult = `
%ARGS_ZOD%
%RESULT_ZOD%

const %JS_FUNCTION% = async (args) => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = schemaToIdl({schema: %ARGS_SCHEMA%, value: parsedArgs});

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
\tconst idlResult = await %RS_FUNCTION%(idlArgs);

\tconst result = schemaFromIdl({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const jsTemplateWithArgsNoResult = `
%ARGS_ZOD%

const %JS_FUNCTION% = async (args) => {
\tconst parsedArgs = %ARGS_SCHEMA%.parse(args);
\tconst idlArgs = schemaToIdl({schema: %ARGS_SCHEMA%, value: parsedArgs});

\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
\tawait %RS_FUNCTION%(idlArgs);
};`;

export const jsTemplateNoArgsWithResult = `
%RESULT_ZOD%

const %JS_FUNCTION% = async () => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
\tconst idlResult = await %RS_FUNCTION%();

\tconst result = schemaFromIdl({schema: %RESULT_SCHEMA%, value: idlResult});
\treturn %RESULT_SCHEMA%.parse(result);
};`;

export const jsTemplateNoArgsNoResult = `
const %JS_FUNCTION% = async () => {
\tconst {%RS_FUNCTION%} = await getSatelliteExtendedActor({idlFactory});
\tawait %RS_FUNCTION%();
};`;
