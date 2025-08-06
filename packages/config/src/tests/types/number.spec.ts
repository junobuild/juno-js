import {describe, expect, it} from 'vitest';
import {z} from 'zod/v4';
import {ConfigNumberSchema} from '../../types/numeric';

describe('NumericValue', () => {
  it('should parse a number', () => {
    const value = ConfigNumberSchema.parse(42);
    expect(value).toBe(42);
  });

  it('should parse a bigint', () => {
    const value = ConfigNumberSchema.parse(42n);
    expect(value).toBe(42n);
  });

  it('should fail on a string', () => {
    expect(() => ConfigNumberSchema.parse('42')).toThrowError(z.ZodError);
  });

  it('should fail on a boolean', () => {
    expect(() => ConfigNumberSchema.parse(true)).toThrowError(z.ZodError);
  });

  it('should fail on null', () => {
    expect(() => ConfigNumberSchema.parse(null)).toThrowError(z.ZodError);
  });

  it('should fail on undefined', () => {
    expect(() => ConfigNumberSchema.parse(undefined)).toThrowError(z.ZodError);
  });
});
