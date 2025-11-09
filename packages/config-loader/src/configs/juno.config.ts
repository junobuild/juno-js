import type {JunoConfig, JunoConfigFnOrObject} from '@junobuild/config';
import {existsSync, readFileSync} from 'node:fs';
import {access, lstat} from 'node:fs/promises';
import {join} from 'node:path';
import type {ConfigFile, ConfigFilename} from '../types/config';
import {mjs, ts} from '../utils/config.utils';
import {configFile, readConfig} from './_config';

export const junoConfigExist = async (params: {filename: ConfigFilename}): Promise<boolean> => {
  try {
    const {configPath} = junoConfigFile(params);

    // We can access the file - i.e. it exists.
    await access(configPath);

    // We also double check it's a file and not a directory.
    // Note: A directory can be created by and on Docker start when the referenced config file in the docker-compose.yml file does not point to an existing file.
    return (await lstat(configPath)).isFile();
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};

export const junoConfigFile = configFile;

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
      interface PackageJson {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        type?: string;
      }

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
  ConfigFnOrObject extends JunoConfigFnOrObject,
  Config extends JunoConfig
>(params: {
  filename: ConfigFilename;
  config: (userConfig: ConfigFnOrObject) => Config;
}): Promise<Config> => await readConfig(params);
