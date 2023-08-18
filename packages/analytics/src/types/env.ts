export type EnvironmentWorkerPath = string;

export interface EnvironmentWorker {
  path?: EnvironmentWorkerPath;
}

export interface EnvironmentProxyUrls {
  pageViewProxyUrl?: string;
  trackEventProxyUrl?: string;
}

export type EnvironmentProxy = {
  orbiterId: string;
  satelliteId: string;
} & EnvironmentProxyUrls;

export type Environment = EnvironmentProxy & {
  worker?: EnvironmentWorker;
};
