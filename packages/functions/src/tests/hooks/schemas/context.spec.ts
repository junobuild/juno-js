import {z} from 'zod/v4';
import {
  AssertFunctionSchema,
  HookContextSchema,
  RunFunctionSchema
} from '../../../hooks/schemas/context';

describe('context', () => {
  describe('HookContext', () => {
    const MockDataSchema = z.object({
      field1: z.string(),
      field2: z.number()
    });

    const validHookContext = {
      caller: new Uint8Array([1, 2, 3]),
      data: {
        field1: 'test',
        field2: 42
      }
    };

    it('should validate a valid HookContext', () => {
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(validHookContext)).not.toThrow();
    });

    it('should reject a HookContext without caller', () => {
      const {caller, ...invalidContext} = validHookContext;
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(invalidContext)).toThrow();
    });

    it('should reject a HookContext with an invalid caller type', () => {
      const invalidContext = {...validHookContext, caller: 'invalid_caller'};
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(invalidContext)).toThrow();
    });

    it('should reject a HookContext without data', () => {
      const {data, ...invalidContext} = validHookContext;
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(invalidContext)).toThrow();
    });

    it('should reject a HookContext with invalid data structure', () => {
      const invalidContext = {...validHookContext, data: {field1: 42, field2: 'wrong'}}; // Reversed types
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(invalidContext)).toThrow();
    });

    it('should reject a HookContext with unknown fields', () => {
      const invalidContext = {...validHookContext, extra_field: 'should not be allowed'};
      const schema = HookContextSchema(MockDataSchema);
      expect(() => schema.parse(invalidContext)).toThrow();
    });
  });

  describe('RunFunction', () => {
    const MockContextSchema = z.object({
      field1: z.string(),
      field2: z.number()
    });

    const validPromiseVoidFunction = async (context: z.infer<typeof MockContextSchema>) => {
      console.log('Function executed with:', context);
    };

    const validVoidFunction = (context: z.infer<typeof MockContextSchema>) => {
      console.log('Function executed with:', context);
    };

    it('should validate a correctly typed function with return promise void', () => {
      const schema = RunFunctionSchema(MockContextSchema);
      expect(() => schema.parse(validPromiseVoidFunction)).not.toThrow();
    });

    it('should validate a correctly typed function with return void', () => {
      const schema = RunFunctionSchema(MockContextSchema);
      expect(() => schema.parse(validVoidFunction)).not.toThrow();
    });

    it('should reject a non-function value', () => {
      const schema = RunFunctionSchema(MockContextSchema);
      expect(() => schema.parse('not_a_function')).toThrow();
    });
  });

  describe('AssertFunction', () => {
    const MockContextSchema = z.object({
      field1: z.string(),
      field2: z.number()
    });

    const validFunction = (context: z.infer<typeof MockContextSchema>) => {
      console.log('Function executed with:', context);
    };

    it('should validate a correctly typed function', () => {
      const schema = AssertFunctionSchema(MockContextSchema);
      expect(() => schema.parse(validFunction)).not.toThrow();
    });

    it('should reject a non-function value', () => {
      const schema = AssertFunctionSchema(MockContextSchema);
      expect(() => schema.parse('not_a_function')).toThrow();
    });
  });
});
