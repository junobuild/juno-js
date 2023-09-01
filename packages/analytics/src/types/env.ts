export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export type EnvironmentActor = {
  orbiterId: string;
  satelliteId: string;
  env?: 'dev' | 'prod';
};

export type Environment = EnvironmentActor & {
  worker?: EnvironmentWorker;
};
