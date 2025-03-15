import {RawPrincipalSchema} from '../../schemas/candid';

describe('candid', () => {
  it('should validate a valid RawPrincipal', () => {
    expect(() => RawPrincipalSchema.parse(new Uint8Array([4, 5, 6]))).not.toThrow();
  });

  it('should reject an invalid RawPrincipal', () => {
    expect(() => RawPrincipalSchema.parse('invalid')).toThrow();
    expect(() => RawPrincipalSchema.parse(123)).toThrow();
  });
});
