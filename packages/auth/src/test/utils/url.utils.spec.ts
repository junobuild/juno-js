import {toBase64URL} from '../../utils/url.utils';

describe('url.utils', () => {
  describe('toBase64URL', () => {
    it('should encode "Hello" as base64url', () => {
      const input = new Uint8Array([72, 101, 108, 108, 111]);
      expect(toBase64URL(input)).toBe('SGVsbG8');
    });

    it('should replace + and / with - and _', () => {
      const input = Uint8Array.from([251, 255, 255]);
      const out = toBase64URL(input);
      expect(out).not.toContain('+');
      expect(out).not.toContain('/');
      expect(out).toContain('-');
      expect(out).toContain('_');
    });

    it('should remove padding', () => {
      const input = new Uint8Array([1]);
      expect(toBase64URL(input).includes('=')).toBeFalsy();
    });
  });
});
