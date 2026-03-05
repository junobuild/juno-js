import * as z from 'zod';
import {CUSTOM_FUNCTION_TYPE} from '../../functions/schemas/function';
import '../../functions/wrappers';
import {RawData} from '../../schemas/db';
import {decodeDocData, encodeDocData} from '../../sdk/serializer.sdk';

global.__juno_satellite_datastore_raw_data_to_text = vi.fn((data: RawData) =>
  new TextDecoder().decode(data)
);

global.__juno_satellite_datastore_raw_data_from_text = vi.fn(
  (data: string): RawData => new TextEncoder().encode(data)
);

describe('wrappers', () => {
  const mockQuery = {
    type: CUSTOM_FUNCTION_TYPE.QUERY
  } as const;

  describe('__juno_satellite_fn_invoke_sync', () => {
    it('should call handler with no args when raw is undefined', () => {
      const handler = vi.fn();
      const config = {...mockQuery, handler};

      globalThis.__juno_satellite_fn_invoke_sync(config);

      expect(handler).toHaveBeenCalledWith();
    });

    it('should decode raw and pass parsed args to handler', () => {
      const data = {name: 'test'};
      const raw = encodeDocData(data);
      const argsSchema = z.object({name: z.string()});
      const handler = vi.fn();

      const config = {...mockQuery, args: argsSchema, handler};

      globalThis.__juno_satellite_fn_invoke_sync(config, raw);

      expect(handler).toHaveBeenCalledWith(decodeDocData(raw));
    });

    it('should parse and encode result when result schema is defined', () => {
      const data = {value: 'hello'};
      const resultSchema = z.object({value: z.string()});
      const handler = vi.fn().mockReturnValue(data);

      const config = {...mockQuery, result: resultSchema, handler};

      globalThis.__juno_satellite_fn_invoke_sync(config);

      expect(globalThis.jsResult).toEqual(encodeDocData(data));
    });

    it('should set jsResult to undefined when no result schema', () => {
      const handler = vi.fn().mockReturnValue('something');
      const config = {...mockQuery, handler};

      globalThis.__juno_satellite_fn_invoke_sync(config);

      expect(globalThis.jsResult).toBeUndefined();
    });
  });

  describe('__juno_satellite_fn_invoke_async', () => {
    it('should call handler with no args when raw is undefined', async () => {
      const handler = vi.fn().mockResolvedValue(undefined);
      const config = {...mockQuery, handler};

      await globalThis.__juno_satellite_fn_invoke_async(config);

      expect(handler).toHaveBeenCalledWith();
    });

    it('should decode raw and pass parsed args to handler', () => {
      const data = {name: 'test'};
      const raw = encodeDocData(data);
      const argsSchema = z.object({name: z.string()});
      const handler = vi.fn();

      const config = {
        type: CUSTOM_FUNCTION_TYPE.QUERY,
        args: argsSchema,
        handler
      };

      globalThis.__juno_satellite_fn_invoke_sync(config, raw);

      expect(handler).toHaveBeenCalledWith(decodeDocData(raw));
    });

    it('should parse and encode result when result schema is defined', () => {
      const data = {value: 'hello'};
      const resultSchema = z.object({value: z.string()});
      const handler = vi.fn().mockReturnValue(data);

      const config = {
        type: CUSTOM_FUNCTION_TYPE.QUERY,
        result: resultSchema,
        handler
      };

      globalThis.__juno_satellite_fn_invoke_sync(config);

      expect(globalThis.jsResult).toEqual(encodeDocData(data));
    });

    it('should set jsResult to undefined when no result schema', async () => {
      const handler = vi.fn().mockResolvedValue('something');
      const config = {...mockQuery, handler};

      await globalThis.__juno_satellite_fn_invoke_async(config);

      expect(globalThis.jsResult).toBeUndefined();
    });

    it('should await async handler', async () => {
      let resolved = false;
      const handler = vi.fn().mockImplementation(async () => {
        await new Promise((r) => setTimeout(r, 10));
        resolved = true;
      });

      const config = {...mockQuery, handler};

      await globalThis.__juno_satellite_fn_invoke_async(config);

      expect(resolved).toBe(true);
    });
  });
});
