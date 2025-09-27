import type * as z from 'zod';
import type {EmulatorConfigSchema, NetworkServices} from '../configs/emulator.config';

const DEFAULT_NETWORK_SERVICES: NetworkServices = {
  registry: false,
  cmc: true,
  icp: true,
  cycles: true,
  nns: true,
  sns: false,
  internet_identity: true,
  nns_dapp: false
} as const;

const SATELLITE_NETWORK_SERVICES: NetworkServices = {
  ...DEFAULT_NETWORK_SERVICES,
  cmc: false,
  cycles: false,
  nns: false
} as const;

const NNS_DAPP_REQUIRED_SERVICES = ['cmc', 'icp', 'nns', 'sns', 'internet_identity'] as const;

type EmulatorConfigInput = z.input<typeof EmulatorConfigSchema>;

const refineNetworkServices = (cfg: EmulatorConfigInput, ctx: z.RefinementCtx) => {
  const defaultServices =
    'satellite' in cfg ? SATELLITE_NETWORK_SERVICES : DEFAULT_NETWORK_SERVICES;
  const mergedServices = {...defaultServices, ...(cfg.network?.services ?? {})};

  if (mergedServices.nns_dapp) {
    const hasMissingServices =
      NNS_DAPP_REQUIRED_SERVICES.find(
        (k) => mergedServices[k as keyof typeof mergedServices] === false
      ) !== undefined;

    if (hasMissingServices) {
      ctx.addIssue({
        code: 'custom',
        path: ['network', 'services', 'nns_dapp'],
        message: `nns_dapp requires: ${NNS_DAPP_REQUIRED_SERVICES.join(', ')}`
      });
    }
  }
};

export const refineEmulatorConfig = (cfg: EmulatorConfigInput, ctx: z.RefinementCtx) => {
  if (cfg.network === undefined) {
    return;
  }

  if (cfg.network.services === undefined) {
    return;
  }

  refineNetworkServices(cfg, ctx);
};
