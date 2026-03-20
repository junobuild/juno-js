import {nonNullish} from '@dfinity/utils';
import * as z from 'zod';
import {decodeDocData, encodeDocData} from '../sdk/serializer.sdk';
import {QuerySchema} from './query';
import {CustomFunctionGuardSchema} from './schemas/function';
import {UpdateSchema} from './update';

const ConfigSchema = z.union([QuerySchema, UpdateSchema]);
type Config = z.infer<typeof ConfigSchema>;

const ConfigWithGuardSchema = ConfigSchema.and(
  z.strictObject({
    guard: CustomFunctionGuardSchema
  })
);

globalThis.__juno_satellite_fn_guard_sync = (config: Config) => {
  const configWithGuard = ConfigWithGuardSchema.parse(config);
  configWithGuard.guard();
};

// eslint-disable-next-line local-rules/prefer-object-params
globalThis.__juno_satellite_fn_invoke_sync = (config: Config, raw?: Uint8Array<ArrayBuffer>) => {
  ConfigSchema.parse(config);

  const args =
    'args' in config && config.args instanceof z.ZodType
      ? config.args?.parse(nonNullish(raw) ? decodeDocData(raw) : undefined)
      : undefined;

  const execute = () => {
    if (nonNullish(args)) {
      return (config.handler as (args: unknown) => unknown)(args);
    }

    return (config.handler as () => unknown)();
  };

  const result = execute();

  const parsed =
    'result' in config && config.result instanceof z.ZodType
      ? config.result?.parse(result)
      : undefined;

  globalThis.jsResult = nonNullish(parsed) ? encodeDocData(parsed) : parsed;
};

// eslint-disable-next-line local-rules/prefer-object-params
globalThis.__juno_satellite_fn_invoke_async = async (
  config: Config,
  raw?: Uint8Array<ArrayBuffer>
) => {
  ConfigSchema.parse(config);

  const args =
    'args' in config && config.args instanceof z.ZodType
      ? config.args?.parse(nonNullish(raw) ? decodeDocData(raw) : undefined)
      : undefined;

  const execute = async () => {
    if (nonNullish(args)) {
      return await (config.handler as (args: unknown) => unknown)(args);
    }

    return await (config.handler as () => unknown)();
  };

  const result = await execute();

  const parsed =
    'result' in config && config.result instanceof z.ZodType
      ? config.result?.parse(result)
      : undefined;

  globalThis.jsResult = nonNullish(parsed) ? encodeDocData(parsed) : parsed;
};
