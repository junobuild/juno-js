import {Principal} from '@dfinity/principal';
import {PrincipalSchema, RawPrincipalSchema} from '../../schemas/candid';

describe('candid', () => {
  describe('RawPrincipal', () => {
    it('should validate a valid RawPrincipal', () => {
      expect(() => RawPrincipalSchema.parse(new Uint8Array([4, 5, 6]))).not.toThrow();
    });

    it('should reject an invalid RawPrincipal', () => {
      expect(() => RawPrincipalSchema.parse('invalid')).toThrow();
      expect(() => RawPrincipalSchema.parse(123)).toThrow();
    });
  });

  describe('Principal', () => {
    const mockPrincipalText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';

    it('should validate a valid Principal', () => {
      expect(() => PrincipalSchema.parse(Principal.fromText(mockPrincipalText))).not.toThrow();
    });

    it('should reject an invalid RawPrincipal', () => {
      expect(() => PrincipalSchema.parse('invalid')).toThrow();
      expect(() => PrincipalSchema.parse(123)).toThrow();
      expect(() => PrincipalSchema.parse(Uint8Array.from([1, 2, 3]))).toThrow();
    });
  });
});
