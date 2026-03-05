import {nonNullish} from '@dfinity/utils';
import {decodeDocData, encodeDocData} from '../sdk/serializer.sdk';
import type {Query} from './query';
import type {Update} from './update';

type Config = Query | Update;

// eslint-disable-next-line local-rules/prefer-object-params
globalThis.__juno_satellite_fn_invoke_sync = (config: Config, raw?: Uint8Array<ArrayBuffer>) => {
  const args = config.args?.parse(nonNullish(raw) ? decodeDocData(raw) : undefined);

  const execute = () => {
    if (nonNullish(args)) {
      return config.handler(args);
    }

    return config.handler();
  };

  const result = execute();

  const parsed = config.result?.parse(result);

  globalThis.jsResult = nonNullish(parsed) ? encodeDocData(parsed) : parsed;
};

// eslint-disable-next-line local-rules/prefer-object-params
globalThis.__juno_satellite_fn_invoke_async = async (
  config: Config,
  raw?: Uint8Array<ArrayBuffer>
) => {
  const args = config.args?.parse(nonNullish(raw) ? decodeDocData(raw) : undefined);

  const execute = async () => {
    if (nonNullish(args)) {
      return await config.handler(args);
    }

    return await config.handler();
  };

  const result = await execute();

  const parsed = config.result?.parse(result);

  globalThis.jsResult = nonNullish(parsed) ? encodeDocData(parsed) : parsed;
};
