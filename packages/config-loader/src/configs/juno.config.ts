import type {
  JunoConfig,
  JunoConfigFnOrObject,
  JunoDevConfig,
  JunoDevConfigFnOrObject
} from '@junobuild/config';
import {existsSync, readFileSync} from 'node:fs';
import {access, readFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import type {ConfigFile, ConfigFilename} from '../types/config';
import {nodeRequire} from '../utils/node.utils';

export const junoConfigExist = async (params: {filename: ConfigFilename}): Promise<boolean> => {
  try {
    const {configPath} = junoConfigFile(params);
    await access(configPath);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
};

const ts = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.ts`);
const js = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.js`);
const mjs = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.mjs`);

export const junoConfigFile = ({filename}: {filename: ConfigFilename}): ConfigFile => {
  const junoTs = ts(filename);

  if (existsSync(junoTs)) {
    return {
      configPath: junoTs,
      configType: 'ts'
    };
  }

  const junoJs = js(filename);

  if (existsSync(junoJs)) {
    return {
      configPath: junoJs,
      configType: 'js'
    };
  }

  const junoMjs = mjs(filename);

  if (existsSync(junoMjs)) {
    return {
      configPath: junoMjs,
      configType: 'js'
    };
  }

  const junoCjs = join(process.cwd(), `${filename}.cjs`);

  if (existsSync(junoCjs)) {
    return {
      configPath: junoCjs,
      configType: 'js'
    };
  }

  // Support for original juno.json or juno.dev.json file
  // juno.config || juno.dev.config => juno.json || juno.dev.json
  const junoJsonDeprecated = join(process.cwd(), `${filename.replace('.config', '')}.json`);

  if (existsSync(junoJsonDeprecated)) {
    return {
      configPath: junoJsonDeprecated,
      configType: 'json'
    };
  }

  return {
    configPath: join(process.cwd(), `${filename}.json`),
    configType: 'json'
  };
};

export const detectJunoConfigType = ({
  filename
}: {
  filename: ConfigFilename;
}): ConfigFile | undefined => {
  const tsconfig = join(process.cwd(), 'tsconfig.json');

  if (existsSync(tsconfig)) {
    const junoTs = ts(filename);

    return {
      configPath: junoTs,
      configType: 'ts'
    };
  }

  try {
    const packageJsonPath = join(process.cwd(), 'package.json');

    if (existsSync(packageJsonPath)) {
      type PackageJson = {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        type?: string;
      };

      const packageJson: PackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      if (
        'typescript' in (packageJson.dependencies ?? {}) ||
        'typescript' in (packageJson.devDependencies ?? {})
      ) {
        const junoTs = ts(filename);

        return {
          configPath: junoTs,
          configType: 'ts'
        };
      }

      if (packageJson.type === 'module') {
        const junoMjs = mjs(filename);

        return {
          configPath: junoMjs,
          configType: 'js'
        };
      }
    }
  } catch (_error: unknown) {
    // We ignore the error as returning undefined will lead the CLI to ask the user what type of configuration type should be used.
  }

  return undefined;
};

export const readJunoConfig = async <
  ConfigFnOrObject extends JunoConfigFnOrObject | JunoDevConfigFnOrObject,
  Config extends JunoConfig | JunoDevConfig
>({
  config,
  ...rest
}: {
  filename: ConfigFilename;
  config: (userConfig: ConfigFnOrObject) => Config;
}): Promise<Config> => {
  const {configPath, configType} = junoConfigFile({...rest});

  switch (configType) {
    case 'ts':
    case 'js': {
      const {default: userConfig} = nodeRequire<ConfigFnOrObject>({
        id: configPath,
        extension: extname(configPath)
      });
      return config(userConfig);
    }
    default: {
      const buffer = await readFile(configPath);
      return JSON.parse(buffer.toString('utf-8'));
    }
  }
};
