import {Principal} from '@dfinity/principal';
import {
  RawUserIdSchema,
  TimestampSchema,
  UserIdSchema,
  VersionSchema
} from '../../schemas/satellite';

describe('core', () => {
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

  it('should validate a valid RawUserId (since it inherits from RawPrincipal)', () => {
    expect(() => RawUserIdSchema.parse(new Uint8Array([7, 8, 9]))).not.toThrow();
  });

  it('should reject an invalid RawUserId', () => {
    expect(() => RawUserIdSchema.parse('not a Uint8Array')).toThrow();
    expect(() => RawUserIdSchema.parse(null)).toThrow();
  });

  it('should validate a valid UserId (since it inherits from Principal)', () => {
    expect(() => UserIdSchema.parse(Principal.anonymous())).not.toThrow();
  });

  it('should reject an invalid UserId', () => {
    expect(() => UserIdSchema.parse('not a Uint8Array')).toThrow();
    expect(() => UserIdSchema.parse(null)).toThrow();
    expect(() => UserIdSchema.parse(Uint8Array.from([1, 2, 3]))).toThrow();
  });
});
