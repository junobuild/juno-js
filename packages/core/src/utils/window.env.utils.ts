// TODO: duplicated because those should not be bundled in web worker. We can avoid this by transforming utils into a library of modules.
type ImportMeta = {env: Record<string, string> | undefined};

export const envSatelliteId = (): string | undefined => {
  const viteEnvSatelliteId = (): string | undefined =>
    typeof import.meta !== 'undefined' &&
    typeof (import.meta as unknown as ImportMeta).env !== 'undefined'
      ? ((import.meta as unknown as ImportMeta).env?.VITE_SATELLITE_ID ??
        (import.meta as unknown as ImportMeta).env?.PUBLIC_SATELLITE_ID)
      : undefined;

  return typeof process !== 'undefined'
    ? (process.env?.NEXT_PUBLIC_SATELLITE_ID ?? viteEnvSatelliteId())
    : viteEnvSatelliteId();
};

export const envContainer = (): string | undefined => {
  const viteEnvContainer = (): string | undefined =>
    typeof import.meta !== 'undefined' &&
    typeof (import.meta as unknown as ImportMeta).env !== 'undefined'
      ? ((import.meta as unknown as ImportMeta).env?.VITE_CONTAINER ??
        (import.meta as unknown as ImportMeta).env?.PUBLIC_CONTAINER)
      : undefined;

  return typeof process !== 'undefined'
    ? (process.env?.NEXT_PUBLIC_CONTAINER ?? viteEnvContainer())
    : viteEnvContainer();
};
