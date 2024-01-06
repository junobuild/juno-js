import type {Identity} from '@dfinity/agent';

export interface ActorParameters {
  identity: Identity;
  fetch?: typeof fetch;
  container?: boolean | string;
}

export interface SatelliteParameters extends ActorParameters {
  satelliteId?: string;
}

export interface MissionControlParameters extends ActorParameters {
  missionControlId?: string;
}

export interface ConsoleParameters extends ActorParameters {
  consoleId?: string;
}

export interface OrbiterParameters extends ActorParameters {
  orbiterId?: string;
}
