export const isBrowser = () => typeof window !== `undefined`;

type ImportMeta = {env: Record<string, string>};

export const processEnvSatelliteId = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env?.NEXT_PUBLIC_SATELLITE_ID
    : typeof import.meta !== undefined &&
        typeof (import.meta as unknown as ImportMeta).env !== undefined
      ? (import.meta as unknown as ImportMeta).env.VITE_SATELLITE_ID ??
        (import.meta as unknown as ImportMeta).env.PUBLIC_SATELLITE_ID
      : undefined;

export const processEnvOrbiterId = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env?.NEXT_PUBLIC_ORBITER_ID
    : typeof import.meta !== undefined &&
        typeof (import.meta as unknown as ImportMeta).env !== undefined
      ? (import.meta as unknown as ImportMeta).env.VITE_ORBITER_ID ??
        (import.meta as unknown as ImportMeta).env.PUBLIC_ORBITER_ID
      : undefined;

export const processEnvContainer = (): string | undefined =>
  typeof process !== 'undefined'
    ? process.env?.NEXT_PUBLIC_CONTAINER
    : typeof import.meta !== undefined &&
        typeof (import.meta as unknown as ImportMeta).env !== undefined
      ? (import.meta as unknown as ImportMeta).env.VITE_CONTAINER ??
        (import.meta as unknown as ImportMeta).env.PUBLIC_CONTAINER
      : undefined;
