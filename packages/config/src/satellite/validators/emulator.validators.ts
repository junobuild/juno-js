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

const CMC_REQUIRED_SERVICES = ['icp', 'nns'] as const;
const NNS_DAPP_REQUIRED_SERVICES = ['cmc', 'icp', 'nns', 'sns', 'internet_identity'] as const;

type EmulatorConfigInput = z.input<typeof EmulatorConfigSchema>;

// eslint-disable-next-line local-rules/prefer-object-params
const refineNetworkServices = (cfg: EmulatorConfigInput, ctx: z.RefinementCtx) => {
  const defaultServices =
    'satellite' in cfg ? SATELLITE_NETWORK_SERVICES : DEFAULT_NETWORK_SERVICES;
  const mergedServices = {...defaultServices, ...(cfg.network?.services ?? {})};

  const assertServices = ({
    requiredServices,
    key
  }: {
    requiredServices: typeof NNS_DAPP_REQUIRED_SERVICES | typeof CMC_REQUIRED_SERVICES;
    key: string;
  }) => {
    const hasMissingServices =
      requiredServices.find((k) => mergedServices[k as keyof typeof mergedServices] === false) !==
      undefined;

    if (hasMissingServices) {
      ctx.addIssue({
        code: 'custom',
        path: ['network', 'services', key],
        message: `${key} requires: ${requiredServices.join(', ')}`
      });
    }
  };

  if (mergedServices.nns_dapp) {
    assertServices({
      requiredServices: NNS_DAPP_REQUIRED_SERVICES,
      key: 'nns_dapp'
    });
  }

  if (mergedServices.cmc) {
    assertServices({
      requiredServices: CMC_REQUIRED_SERVICES,
      key: 'cmc'
    });
  }
};

// eslint-disable-next-line local-rules/prefer-object-params
export const refineEmulatorConfig = (cfg: EmulatorConfigInput, ctx: z.RefinementCtx) => {
  if (cfg.network === undefined) {
    return;
  }

  if (cfg.network.services === undefined) {
    return;
  }

  refineNetworkServices(cfg, ctx);
};
