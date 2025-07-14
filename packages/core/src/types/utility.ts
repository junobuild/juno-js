export type ExcludeDate<T> = {
  [K in keyof T]: T[K] extends Date ? never : T[K] extends object ? ExcludeDate<T[K]> : T[K];
};
