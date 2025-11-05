import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import type {ConfigFile, ConfigFilename} from '../types/config';
import {js, mjs, ts} from '../utils/config.utils';
import {nodeRequire} from '../utils/node.utils';

export const configFile = ({filename}: {filename: ConfigFilename}): ConfigFile => {
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

export const readConfig = async <ConfigFnOrObject, Config>({
  config,
  ...rest
}: {
  filename: ConfigFilename;
  config: (userConfig: ConfigFnOrObject) => Config;
}): Promise<Config> => {
  const {configPath, configType} = configFile({...rest});

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
