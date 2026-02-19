import {InvalidUrlError} from '../../../delegation/errors';
import {parseUrl} from '../../../delegation/utils/url.utils';

describe('url.utils', () => {
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
