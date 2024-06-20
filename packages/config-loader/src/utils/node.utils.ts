import {transformFileSync} from '@babel/core';
import * as mod from '@babel/plugin-transform-modules-commonjs';
import * as ts from '@babel/preset-typescript';
import {
  defineConfig,
  defineConsoleConfig,
  defineDevConfig,
  type JunoConfig,
  type JunoConsoleConfig,
  type JunoDevConfig
} from '@junobuild/config';

/**
 * Adapted source from Stencil (https://github.com/ionic-team/stencil/blob/main/src/compiler/sys/node-require.ts)
 */
export const nodeRequire = <T>({id, extension}: {id: string; extension: string}): {default: T} => {
  // ensure we cleared out node's internal require() cache for this file
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete require.cache[id];

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Module = require('module');
  const originalLoad = Module._load;

  try {
    // let's override node's require for a second
    // don't worry, we'll revert this when we're done
    require.extensions[extension] = (module: NodeJS.Module, fileName: string) => {
      // let's transpile with Babel regardless if TS or JS
      const sourceText = transformFileSync(fileName, {
        presets: [ts.default],
        plugins: [mod.default]
      }).code;

      interface NodeModuleWithCompile extends NodeModule {
        // eslint-disable-next-line @typescript-eslint/method-signature-style
        _compile(code: string, filename: string): T;
      }

      // we need to coerce because of the requirements for the arguments to
      // this function.
      (module as NodeModuleWithCompile)._compile(sourceText, fileName);
    };

    // We override defineConfig because the library is unknown in the module we are trying to load.
    // This need to be a function and not an arrow function because of the "arguments"
    Module._load = function (request: string): unknown {
      if (request === '@junobuild/config') {
        return {
          defineConfig: (config: JunoConfig) => defineConfig(config),
          defineDevConfig: (config: JunoDevConfig) => defineDevConfig(config),
          defineConsoleConfig: (config: JunoConsoleConfig) => defineConsoleConfig(config)
        };
      }

      // eslint-disable-next-line prefer-rest-params
      return originalLoad.apply(this, arguments);
    };

    // let's do this!
    return require(id);
  } finally {
    // all set, let's go ahead and reset the require back to the default
    require.extensions[extension] = undefined;

    // Redo our hack
    Module._load = originalLoad;
  }
};
