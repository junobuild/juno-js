import {nonNullish} from './null.utils';

export const isBrowser = () => typeof window !== `undefined`;

export const processEnv = ({
  key,
  envPrefix
}: {
  key: 'SATELLITE_ID' | 'ORBITER_ID' | 'CONTAINER';
  envPrefix?: string;
}): string | undefined =>
  typeof process !== 'undefined'
    ? nonNullish(envPrefix)
      ? process.env[`${envPrefix}${key}`]
      : process.env[`NEXT_PUBLIC_${key}`] ??
        process.env[`VITE_${key}`] ??
        process.env[`PUBLIC_${key}`]
    : undefined;
