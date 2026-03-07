import * as z from 'zod';
import {JUNO_FUNCTION_TYPE} from '../../../functions/constants';
import {CustomFunctionSchema} from '../../../functions/schemas/function';

describe('function', () => {
  describe('CustomFunctionSchema', () => {
    describe('type', () => {
      it('should accept query type', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should accept update type', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.UPDATE,
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should reject invalid type', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: '__juno_function_invalid',
            handler: () => {}
          })
        ).toThrow();
      });
    });

    describe('handler', () => {
      it('should accept a sync void handler with no args and no result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should accept an async void handler with no args and no result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: async () => {}
          })
        ).not.toThrow();
      });

      it('should accept a handler with args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            args: z.object({name: z.string()}),
            handler: (args: unknown) => args
          })
        ).not.toThrow();
      });

      it('should accept a handler with result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            result: z.object({value: z.string()}),
            handler: () => ({value: 'result'})
          })
        ).not.toThrow();
      });

      it('should accept an async handler with result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            result: z.object({value: z.string()}),
            handler: async () => ({value: 'result'})
          })
        ).not.toThrow();
      });

      it('should accept a handler with args and result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            args: z.object({name: z.string()}),
            result: z.object({value: z.string()}),
            handler: (args: unknown) => args
          })
        ).not.toThrow();
      });

      it('should reject missing handler', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY
          })
        ).toThrow();
      });
    });

    describe('args', () => {
      it('should accept a zod schema as args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            args: z.object({name: z.string()}),
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should reject a non-zod value as args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            args: {name: 'string'},
            handler: () => {}
          })
        ).toThrow();
      });

      it('should accept missing args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });
    });

    describe('result', () => {
      it('should accept a zod schema as result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            result: z.object({value: z.string()}),
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should reject a non-object zod schema as result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            result: z.string(),
            handler: () => {}
          })
        ).toThrow();
      });

      it('should accept missing result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });
    });

    describe('strict', () => {
      it('should reject unknown fields', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: JUNO_FUNCTION_TYPE.QUERY,
            handler: () => {},
            unknown: 'field'
          })
        ).toThrow();
      });
    });
  });
});
