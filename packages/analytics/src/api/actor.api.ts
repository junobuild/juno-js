import type {_SERVICE as OrbiterActor} from '../../declarations/orbiter/orbiter.did';
// eslint-disable-next-line import/no-relative-parent-imports
import {idlFactory} from '../../declarations/orbiter/orbiter.factory.did.js';
import type {EnvironmentActor} from '../types/env';
import {createActor} from '../utils/actor.utils';

export const getOrbiterActor = (env: EnvironmentActor): Promise<OrbiterActor> =>
  createActor({
    idlFactory,
    ...env
  });
