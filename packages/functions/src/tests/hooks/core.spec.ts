import {
  RawDataSchema,
  RawPrincipalSchema,
  RawUserIdSchema,
  TimestampSchema,
  VersionSchema
} from '../../hooks/core';

describe('Core', () => {
  it('should validate a valid Timestamp', () => {
    expect(() => TimestampSchema.parse(1700000000000000n)).not.toThrow();
  });

  it('should reject an invalid Timestamp', () => {
    expect(() => TimestampSchema.parse('not a bigint')).toThrow();
    expect(() => TimestampSchema.parse(123)).toThrow();
  });

  it('should validate a valid Version', () => {
    expect(() => VersionSchema.parse(42n)).not.toThrow();
  });

  it('should reject an invalid Version', () => {
    expect(() => VersionSchema.parse('wrong')).toThrow();
    expect(() => VersionSchema.parse(42)).toThrow();
  });

  it('should validate a valid RawData', () => {
    expect(() => RawDataSchema.parse(new Uint8Array([1, 2, 3]))).not.toThrow();
  });

  it('should reject an invalid RawData', () => {
    expect(() => RawDataSchema.parse('not a Uint8Array')).toThrow();
    expect(() => RawDataSchema.parse([1, 2, 3])).toThrow();
  });

  it('should validate a valid RawPrincipal', () => {
    expect(() => RawPrincipalSchema.parse(new Uint8Array([4, 5, 6]))).not.toThrow();
  });

  it('should reject an invalid RawPrincipal', () => {
    expect(() => RawPrincipalSchema.parse('invalid')).toThrow();
    expect(() => RawPrincipalSchema.parse(123)).toThrow();
  });

  it('should validate a valid RawUserId (since it inherits from RawPrincipal)', () => {
    expect(() => RawUserIdSchema.parse(new Uint8Array([7, 8, 9]))).not.toThrow();
  });

  it('should reject an invalid RawUserId', () => {
    expect(() => RawUserIdSchema.parse('not a Uint8Array')).toThrow();
    expect(() => RawUserIdSchema.parse(null)).toThrow();
  });
});
