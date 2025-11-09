type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type ExcludeDate<T> =
  // drop Date
  T extends Date
    ? never
    : // keep functions callable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends (...args: any) => any
      ? T
      : // keep primitives as-is
        T extends Primitive
        ? T
        : // preserve arrays
          T extends Array<infer U>
          ? ExcludeDate<U>[]
          : // recurse into plain objects/classes
            T extends object
            ? {[K in keyof T]: ExcludeDate<T[K]>}
            : T;
