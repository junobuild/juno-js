import type {
  JunoConfig,
  JunoConfigFnOrObject,
  JunoDevConfig,
  JunoDevConfigFnOrObject
} from '@junobuild/config';
import {existsSync} from 'node:fs';
import {access, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import type {ConfigFilename, ConfigType} from '../types/config';
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

export const junoConfigFile = ({
  filename
}: {
  filename: ConfigFilename;
}): {configPath: string; configType: ConfigType} => {
  const junoTs = join(process.cwd(), `${filename}.ts`);

  if (existsSync(junoTs)) {
    return {
      configPath: junoTs,
      configType: 'ts'
    };
  }

  const junoJs = join(process.cwd(), `${filename}.js`);

  if (existsSync(junoJs)) {
    return {
      configPath: junoJs,
      configType: 'js'
    };
  }

  const junoMjs = join(process.cwd(), `${filename}.mjs`);

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

  // Support for original juno.json file
  const junoJsonDeprecated = join(process.cwd(), filename.replace('config.', ''));

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
    case 'ts': {
      const {default: userConfig} = nodeRequire<ConfigFnOrObject>(configPath);
      return config(userConfig);
    }
    case 'js': {
      const {default: userConfig} = await import(configPath);
      return config(userConfig as ConfigFnOrObject);
    }
    default: {
      const buffer = await readFile(configPath);
      return JSON.parse(buffer.toString('utf-8'));
    }
  }
};
