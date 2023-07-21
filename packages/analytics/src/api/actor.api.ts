import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
import {idlFactory} from '../../declarations/orbiter/orbiter.factory.did.js';
import {EnvironmentActor} from '../types/env';
import {createActor} from '../utils/actor.utils';

export const getOrbiterActor = async (env: EnvironmentActor): Promise<OrbiterActor> =>
  createActor({
    idlFactory,
    ...env
  });
