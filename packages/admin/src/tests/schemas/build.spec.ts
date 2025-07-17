import {BuildTypeSchema} from '../../schemas/build';

describe('build', () => {
  it('accepts valid build types', () => {
    expect(BuildTypeSchema.parse('stock')).toBe('stock');
    expect(BuildTypeSchema.parse('extended')).toBe('extended');
  });

  it('rejects invalid build types', () => {
    expect(() => BuildTypeSchema.parse('custom')).toThrowError();
    expect(() => BuildTypeSchema.parse('')).toThrowError();
    expect(() => BuildTypeSchema.parse(undefined)).toThrowError();
    expect(() => BuildTypeSchema.parse(null)).toThrowError();
  });
});
