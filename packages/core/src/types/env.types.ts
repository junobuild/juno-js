import type {Satellite} from './satellite.types';

export type EnvironmentWorkerPath = string;
export type EnvironmentWorker = true | EnvironmentWorkerPath;

export interface EnvironmentWorkers {
  idle?: EnvironmentWorker;
}

export type Environment = {
  localIdentityCanisterId?: string;
  workers?: EnvironmentWorkers;
} & Required<Pick<Satellite, 'satelliteId'>>;
