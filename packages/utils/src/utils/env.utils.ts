export const isBrowser = () => typeof window !== `undefined`;

export const processEnv = (key: string): string | undefined =>
  typeof process !== 'undefined'
    ? process.env[`NEXT_PUBLIC_${key}`] ??
      process.env[`VITE_${key}`] ??
      process.env[`PUBLIC_${key}`]
    : undefined;
