export const isBrowser = () => typeof window !== `undefined`;

export const processEnvSatelliteId = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_SATELLITE_ID ??
      process.env.VITE_SATELLITE_ID ??
      process.env.PUBLIC_SATELLITE_ID
    : undefined;

export const processEnvOrbiterId = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_ORBITER_ID ??
      process.env.VITE_ORBITER_ID ??
      process.env.PUBLIC_ORBITER_ID
    : undefined;

export const processEnvContainer = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env.NEXT_CONTAINER ?? process.env.VITE_CONTAINERD ?? process.env.PUBLIC_CONTAINER
    : undefined;
