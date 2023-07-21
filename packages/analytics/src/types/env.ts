export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export interface EnvironmentActor {
  localOrbiterCanisterId?: string;
  satelliteId: string;
}

export type Environment = EnvironmentActor & {
  worker?: EnvironmentWorker;
};
