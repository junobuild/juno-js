export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export type Environment = {
  worker?: EnvironmentWorker;
};
