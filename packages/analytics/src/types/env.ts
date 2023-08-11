export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export type EnvironmentProxy = {
  proxyUrl?: string;
  orbiterId: string;
  satelliteId: string;
};

export type Environment = EnvironmentProxy & {
  worker?: EnvironmentWorker;
};
