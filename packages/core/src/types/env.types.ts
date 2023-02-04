import type {Satellite} from './satellite.types';

export type Environment = {
  localIdentityCanisterId?: string;
} & Required<Pick<Satellite, 'satelliteId'>>;
