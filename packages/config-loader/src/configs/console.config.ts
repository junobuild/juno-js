import type {JunoConsoleConfig, JunoConsoleConfigFnOrObject} from '@junobuild/config';
import type {ConfigFilename} from '../types/config';
import {readConfig} from './_config';

export const readConsoleConfig = async <
  ConfigFnOrObject extends JunoConsoleConfigFnOrObject,
  Config extends JunoConsoleConfig
>(params: {
  filename: ConfigFilename;
  config: (userConfig: ConfigFnOrObject) => Config;
}): Promise<Config> => await readConfig(params);
