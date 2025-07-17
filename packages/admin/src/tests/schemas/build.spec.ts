import {BuildSchema} from '../../schemas/build';

describe('build', () => {
  it('accepts valid build types', () => {
    expect(BuildSchema.parse('stock')).toBe('stock');
    expect(BuildSchema.parse('extended')).toBe('extended');
  });

  it('rejects invalid build types', () => {
    expect(() => BuildSchema.parse('custom')).toThrowError();
    expect(() => BuildSchema.parse('')).toThrowError();
    expect(() => BuildSchema.parse(undefined)).toThrowError();
    expect(() => BuildSchema.parse(null)).toThrowError();
  });
});
