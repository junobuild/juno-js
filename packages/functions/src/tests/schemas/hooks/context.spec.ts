import * as z from 'zod';
import {HookContextSchema} from '../../../schemas/hooks/context';

describe('context', () => {
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
