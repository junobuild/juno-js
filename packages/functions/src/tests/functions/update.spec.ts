import * as z from 'zod';
import {CUSTOM_FUNCTION_TYPE} from '../../functions/schemas/function';
import {defineUpdate, UpdateSchema} from '../../functions/update';

describe('update', () => {
  describe('UpdateSchema', () => {
    it('should accept a valid update with no args and no result', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          handler: () => {}
        })
      ).not.toThrow();
    });

    it('should accept a valid update with args only', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          args: z.object({name: z.string()}),
          handler: () => {}
        })
      ).not.toThrow();
    });

    it('should accept a valid update with result only', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          result: z.string(),
          handler: () => 'result'
        })
      ).not.toThrow();
    });

    it('should accept a valid update with args and result', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          args: z.object({name: z.string()}),
          result: z.string(),
          handler: (args: unknown) => args
        })
      ).not.toThrow();
    });

    it('should reject query type', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.QUERY,
          handler: () => {}
        })
      ).toThrow();
    });
  });

  describe('defineUpdate', () => {
    describe('object', () => {
      it('should inject update type with no args and no result', () => {
        const update = defineUpdate({
          handler: () => {}
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should inject update type with args only', () => {
        const update = defineUpdate({
          args: z.object({name: z.string()}),
          handler: (_args: {name: string}) => {}
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should inject update type with result only', () => {
        const update = defineUpdate({
          result: z.string(),
          handler: () => 'result'
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should inject update type with args and result', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const update = defineUpdate({
          args,
          result,
          handler: (input: {name: string}) => input.name
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should preserve args schema', () => {
        const args = z.object({name: z.string()});

        const update = defineUpdate({
          args,
          handler: (_args: {name: string}) => {}
        });

        expect('args' in update && update.args).toBe(args);
      });

      it('should preserve result schema', () => {
        const result = z.string();

        const update = defineUpdate({
          result,
          handler: () => 'result'
        });

        expect('result' in update && update.result).toBe(result);
      });

      it('should preserve handler', () => {
        const handler = () => {};

        const update = defineUpdate({handler});

        expect(update.handler).toBe(handler);
      });

      it('should accept async handler', () => {
        const update = defineUpdate({
          result: z.string(),
          handler: async () => 'result'
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });
    });

    describe('factory function', () => {
      it('should inject update type when called with env', () => {
        const fn = defineUpdate((_env) => ({
          handler: () => {}
        }));

        const update = fn({});

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should preserve args and result when called with env', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const fn = defineUpdate((_env) => ({
          args,
          result,
          handler: (input: {name: string}) => input.name
        }));

        const update = fn({});

        expect('args' in update && update.args).toBe(args);
        expect('result' in update && update.result).toBe(result);
      });

      it('should pass env to factory function', () => {
        const env: Record<string, string> = {region: 'eu-west'};
        let capturedEnv: unknown;

        const fn = defineUpdate((e) => {
          capturedEnv = e;
          return {handler: () => {}};
        });

        fn(env);

        expect(capturedEnv).toBe(env);
      });
    });
  });
});
