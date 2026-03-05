import * as z from 'zod';
import {CUSTOM_FUNCTION_TYPE} from '../../functions/schemas/function';
import {defineUpdate, UpdateSchema} from '../../functions/update';

describe('update', () => {
  describe('UpdateSchema', () => {
    it('should accept a valid update', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          handler: () => {}
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

    it('should accept args and result as zod schemas', () => {
      expect(() =>
        UpdateSchema.parse({
          type: CUSTOM_FUNCTION_TYPE.UPDATE,
          args: z.object({name: z.string()}),
          result: z.string(),
          handler: () => {}
        })
      ).not.toThrow();
    });
  });

  describe('defineUpdate', () => {
    describe('object', () => {
      it('should inject update type', () => {
        const update = defineUpdate({
          handler: () => {}
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should preserve args and result', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const update = defineUpdate({args, result, handler: () => {}});

        expect(update.args).toBe(args);
        expect(update.result).toBe(result);
      });

      it('should preserve handler', () => {
        const handler = (args: unknown) => args;

        const update = defineUpdate({handler});

        expect(update.handler).toBe(handler);
      });

      it('should accept async handler', () => {
        const update = defineUpdate({
          handler: async () => 'result'
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should accept handler with no args and no result', () => {
        const update = defineUpdate({
          handler: () => {}
        });

        expect(update.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });
    });

    describe('factory function', () => {
      it('should inject update type when called with env', () => {
        const update = defineUpdate((_env) => ({
          handler: () => {}
        }));

        const result = update({});

        expect(result.type).toBe(CUSTOM_FUNCTION_TYPE.UPDATE);
      });

      it('should preserve args and result when called with env', () => {
        const args = z.object({name: z.string()});
        const result = z.string();

        const fn = defineUpdate((_env) => ({args, result, handler: () => {}}));
        const resolved = fn({});

        expect(resolved.args).toBe(args);
        expect(resolved.result).toBe(result);
      });

      it('should pass env to factory function', () => {
        const env = {region: 'eu-west'};
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
