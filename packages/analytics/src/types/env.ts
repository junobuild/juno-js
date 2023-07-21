export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export interface EnvironmentActor {
  orbiterId: string;
  env?: "dev" | "prod"
}

export type Environment = EnvironmentActor & {
  worker?: EnvironmentWorker;
  satelliteId: string;
};
