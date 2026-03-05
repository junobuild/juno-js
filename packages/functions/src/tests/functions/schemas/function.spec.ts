import * as z from 'zod';
import {CUSTOM_FUNCTION_TYPE, CustomFunctionSchema} from '../../../functions/schemas/function';

describe('function', () => {
  describe('CustomFunctionSchema', () => {
    describe('type', () => {
      it('should accept query type', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should accept update type', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.UPDATE,
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
      it('should accept a sync handler', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => 'result'
          })
        ).not.toThrow();
      });

      it('should accept an async handler', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: async () => 'result'
          })
        ).not.toThrow();
      });

      it('should accept a void handler', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should accept a handler with args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: (args: unknown) => args
          })
        ).not.toThrow();
      });

      it('should reject missing handler', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY
          })
        ).toThrow();
      });
    });

    describe('args', () => {
      it('should accept a zod schema as args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            args: z.object({name: z.string()}),
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should reject a non-zod value as args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            args: {name: 'string'},
            handler: () => {}
          })
        ).toThrow();
      });

      it('should accept missing args', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });
    });

    describe('result', () => {
      it('should accept a zod schema as result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            result: z.string(),
            handler: () => {}
          })
        ).not.toThrow();
      });

      it('should reject a non-zod value as result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            result: 'string',
            handler: () => {}
          })
        ).toThrow();
      });

      it('should accept missing result', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => {}
          })
        ).not.toThrow();
      });
    });

    describe('strict', () => {
      it('should reject unknown fields', () => {
        expect(() =>
          CustomFunctionSchema.parse({
            type: CUSTOM_FUNCTION_TYPE.QUERY,
            handler: () => {},
            unknown: 'field'
          })
        ).toThrow();
      });
    });
  });
});
