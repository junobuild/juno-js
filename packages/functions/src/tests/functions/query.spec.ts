import * as z from 'zod';
import {defineQuery, QuerySchema} from '../../functions/query';
import {CUSTOM_FUNCTION_TYPE} from '../../functions/schemas/function';

describe('query', () => {
  describe('QuerySchema', () => {
    it('should accept a valid query', () => {
      expect(() =>
        QuerySchema.parse({
          type: CUSTOM_FUNCTION_TYPE.QUERY,
          handler: () => {}
        })
      ).not.toThrow();
    });

    it('should reject update type', () => {
      expect(() =>
        QuerySchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          handler: () => {}
        })
      ).toThrow();
    });

    it('should accept args and result as zod schemas', () => {
      expect(() =>
        QuerySchema.parse({
          type: CUSTOM_FUNCTION_TYPE.QUERY,
          args: z.object({name: z.string()}),
          result: z.string(),
          handler: () => {}
        })
      ).not.toThrow();
    });
  });

  describe('defineQuery', () => {
    describe('object', () => {
      it('should inject query type', () => {
        const query = defineQuery({
          handler: () => {}
        });

        expect(query.type).toBe(CUSTOM_FUNCTION_TYPE.QUERY);
      });

      it('should preserve args and result', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const query = defineQuery({args, result, handler: () => {}});

        expect(query.args).toBe(args);
        expect(query.result).toBe(result);
      });

      it('should preserve handler', () => {
        const handler = (args: unknown) => args;

        const query = defineQuery({handler});

        expect(query.handler).toBe(handler);
      });

      it('should accept async handler', () => {
        const query = defineQuery({
          handler: async () => 'result'
        });

        expect(query.type).toBe(CUSTOM_FUNCTION_TYPE.QUERY);
      });

      it('should accept handler with no args and no result', () => {
        const query = defineQuery({
          handler: () => {}
        });

        expect(query.type).toBe(CUSTOM_FUNCTION_TYPE.QUERY);
      });
    });

    describe('factory function', () => {
      it('should inject query type when called with env', () => {
        const query = defineQuery((_env) => ({
          handler: () => {}
        }));

        const result = query({});

        expect(result.type).toBe(CUSTOM_FUNCTION_TYPE.QUERY);
      });

      it('should preserve args and result when called with env', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const fn = defineQuery((_env) => ({args, result, handler: () => {}}));
        const resolved = fn({});

        expect(resolved.args).toBe(args);
        expect(resolved.result).toBe(result);
      });

      it('should pass env to factory function', () => {
        const env = {region: 'eu-west'};
        let capturedEnv: unknown;

        const fn = defineQuery((e) => {
          capturedEnv = e;
          return {handler: () => {}};
        });

        fn(env);

        expect(capturedEnv).toBe(env);
      });
    });
  });
});
