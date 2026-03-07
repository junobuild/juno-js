import type {Query, Update} from '@junobuild/functions';
import {writeFile} from 'node:fs/promises';
import {parseFunctions} from './services/parser.services';

export interface GenerateArgs {
  outputFile: string;
  code: Uint8Array;
}

export const generateFunctions = async ({code, outputFile}: GenerateArgs) => {
  const originalConsole = globalThis.console;
  const originalRandom = globalThis.Math.random;

  try {
    // @junobuild/functions replaces globalThis.console with a version that calls
    // __ic_cdk_print, which only exists in the WASM host environment. We stub it
    // so the import doesn't throw when the module is evaluated in Node.
    globalThis.__ic_cdk_print = (msg: string) => process.stdout.write(`${msg}\n`);

    // It might be needed
    // globalThis.__juno_satellite_random = () => {
    //   const buf = new Uint32Array(1);
    //   crypto.getRandomValues(buf);
    //   return buf[0];
    // };

    const devModule = await import(
      `data:text/javascript;base64,${Buffer.from(code).toString(`base64`)}`
    );

    // Lazy load the functions this way it uses the globalThis stubs we defined above
    const {QuerySchema, UpdateSchema} = await import('@junobuild/functions');

    const [queries, updates] = Object.entries(devModule).reduce<
      [[string, Query][], [string, Update][]]
    >(
      ([queries, updates], entry) => {
        const [key, value] = entry;

        const config = typeof value === 'function' ? value({}) : value;

        const query = QuerySchema.safeParse(config);
        const update = UpdateSchema.safeParse(config);

        return [
          [...queries, ...(query.success ? [[key, query.data] as [string, Query]] : [])],
          [...updates, ...(update.success ? [[key, update.data] as [string, Update]] : [])]
        ];
      },
      [[], []]
    );

    // No custom functions to generate
    if (queries.length === 0 && updates.length === 0) {
      return;
    }

    const functions = parseFunctions({queries, updates});

    await writeFile(outputFile, functions, 'utf-8');
  } finally {
    globalThis.console = originalConsole;
    globalThis.Math.random = originalRandom;
  }
};
