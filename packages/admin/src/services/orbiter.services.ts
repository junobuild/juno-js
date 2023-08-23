import {version} from '../api/orbiter.api';
import {OrbiterParameters} from '../types/actor.types';

export const orbiterVersion = async (params: {orbiter: OrbiterParameters}): Promise<string> =>
  version(params);
