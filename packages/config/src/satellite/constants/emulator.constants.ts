import type {NetworkServices} from '../configs/emulator.config';

export const DEFAULT_NETWORK_SERVICES: NetworkServices = {
  registry: false,
  cmc: true,
  icp: true,
  cycles: true,
  nns: true,
  sns: false,
  internet_identity: true,
  nns_dapp: false
} as const;

export const DEFAULT_SATELLITE_NETWORK_SERVICES: NetworkServices = {
  ...DEFAULT_NETWORK_SERVICES,
  cmc: false,
  cycles: false,
  nns: false
} as const;
