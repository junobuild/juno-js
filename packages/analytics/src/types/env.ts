export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
  timerInterval?: number;
}

export type EnvironmentActor = {
  orbiterId: string;
  satelliteId: string;
  container?: boolean | string;
};

export type Environment = EnvironmentActor & {
  worker?: EnvironmentWorker;
};
