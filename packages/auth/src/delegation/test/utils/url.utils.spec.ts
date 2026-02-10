import {InvalidUrlError} from '../../errors';
import {parseUrl, toBase64URL} from '../../utils/url.utils';

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

  describe('parseUrl', () => {
    it('should parse a valid URL', () => {
      const result = parseUrl({url: 'https://example.com/path'});
      expect(result).toBeInstanceOf(URL);
      expect(result.protocol).toBe('https:');
      expect(result.hostname).toBe('example.com');
      expect(result.pathname).toBe('/path');
    });

    it('should parse URL with query parameters', () => {
      const result = parseUrl({url: 'https://example.com?foo=bar&baz=qux'});
      expect(result.searchParams.get('foo')).toBe('bar');
      expect(result.searchParams.get('baz')).toBe('qux');
    });

    it('should parse URL with hash', () => {
      const result = parseUrl({url: 'https://example.com#section'});
      expect(result.hash).toBe('#section');
    });

    it('should throw InvalidUrlError for invalid URL', () => {
      expect(() => parseUrl({url: 'not a valid url'})).toThrow(InvalidUrlError);
    });

    it('should throw InvalidUrlError with cause', () => {
      const invalidUrl = 'invalid://malformed url';

      try {
        parseUrl({url: invalidUrl});
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidUrlError);
        expect((error as InvalidUrlError).cause).toBe(invalidUrl);
      }
    });

    it('should throw InvalidUrlError for empty string', () => {
      expect(() => parseUrl({url: ''})).toThrow(InvalidUrlError);
    });
  });
});
