import * as z from 'zod';
import {JUNO_FUNCTION_TYPE} from '../../functions/constants';
import {defineQuery, QuerySchema} from '../../functions/query';

describe('query', () => {
  describe('QuerySchema', () => {
    it('should accept a valid query with no args and no result', () => {
      expect(() =>
        QuerySchema.parse({
          type: JUNO_FUNCTION_TYPE.QUERY,
          handler: () => {}
        })
      ).not.toThrow();
    });

    it('should accept a valid query with args only', () => {
      expect(() =>
        QuerySchema.parse({
          type: JUNO_FUNCTION_TYPE.QUERY,
          args: z.object({name: z.string()}),
          handler: () => {}
        })
      ).not.toThrow();
    });

    it('should accept a valid query with result only', () => {
      expect(() =>
        QuerySchema.parse({
          type: JUNO_FUNCTION_TYPE.QUERY,
          result: z.object({value: z.string()}),
          handler: () => ({value: 'result'})
        })
      ).not.toThrow();
    });

    it('should accept a valid query with args and result', () => {
      expect(() =>
        QuerySchema.parse({
          type: JUNO_FUNCTION_TYPE.QUERY,
          args: z.object({name: z.string()}),
          result: z.object({value: z.string()}),
          handler: (args: unknown) => args
        })
      ).not.toThrow();
    });

    it('should reject update type', () => {
      expect(() =>
        QuerySchema.parse({
          type: JUNO_FUNCTION_TYPE.UPDATE,
          handler: () => {}
        })
      ).toThrow();
    });
  });

  describe('defineQuery', () => {
    describe('object', () => {
      it('should inject query type with no args and no result', () => {
        const query = defineQuery({
          handler: () => {}
        });

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });

      it('should inject query type with args only', () => {
        const query = defineQuery({
          args: z.object({name: z.string()}),
          handler: (_args: {name: string}) => {}
        });

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });

      it('should inject query type with result only', () => {
        const query = defineQuery({
          result: z.object({value: z.string()}),
          handler: () => ({value: 'result'})
        });

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });

      it('should inject query type with args and result', () => {
        const args = z.object({name: z.string()});
        const result = z.object({value: z.string()});

        const query = defineQuery({
          args,
          result,
          handler: (input: {name: string}) => ({value: input.name})
        });

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });

      it('should preserve args schema', () => {
        const args = z.object({name: z.string()});

        const query = defineQuery({
          args,
          handler: (_args: {name: string}) => {}
        });

        expect('args' in query && query.args).toBe(args);
      });

      it('should preserve result schema', () => {
        const result = z.object({value: z.string()});

        const query = defineQuery({
          result,
          handler: () => ({value: 'result'})
        });

        expect('result' in query && query.result).toBe(result);
      });

      it('should preserve handler', () => {
        const handler = () => {};

        const query = defineQuery({handler});

        expect(query.handler).toBe(handler);
      });

      it('should accept async handler', () => {
        const query = defineQuery({
          result: z.object({value: z.string()}),
          handler: async () => ({value: 'result'})
        });

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });
    });

    describe('factory function', () => {
      it('should inject query type when called with env', () => {
        const fn = defineQuery((_env) => ({
          handler: () => {}
        }));

        const query = fn({});

        expect(query.type).toBe(JUNO_FUNCTION_TYPE.QUERY);
      });

      it('should preserve args and result when called with env', () => {
        const args = z.object({name: z.string()});
        const result = z.object({value: z.string()});

        const fn = defineQuery((_env) => ({
          args,
          result,
          handler: (input: {name: string}) => ({value: input.name})
        }));

        const query = fn({});

        expect('args' in query && query.args).toBe(args);
        expect('result' in query && query.result).toBe(result);
      });

      it('should pass env to factory function', () => {
        const env: Record<string, string> = {region: 'eu-west'};
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
