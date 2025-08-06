import {describe, expect, it} from 'vitest';
import {z} from 'zod/v4';
import {NumericValueSchema} from '../../types/numeric';

describe('NumericValue', () => {
  it('should parse a number', () => {
    const value = NumericValueSchema.parse(42);
    expect(value).toBe(42);
  });

  it('should parse a bigint', () => {
    const value = NumericValueSchema.parse(42n);
    expect(value).toBe(42n);
  });

  it('should fail on a string', () => {
    expect(() => NumericValueSchema.parse('42')).toThrowError(z.ZodError);
  });

  it('should fail on a boolean', () => {
    expect(() => NumericValueSchema.parse(true)).toThrowError(z.ZodError);
  });

  it('should fail on null', () => {
    expect(() => NumericValueSchema.parse(null)).toThrowError(z.ZodError);
  });

  it('should fail on undefined', () => {
    expect(() => NumericValueSchema.parse(undefined)).toThrowError(z.ZodError);
  });
});
