import {capitalize, convertCamelToSnake} from './string.utils';

describe('string.utils', () => {
  describe('convertCamelToSnake', () => {
    it('should convert camelCase to snake_case', () => {
      expect(convertCamelToSnake('helloWorld')).toBe('hello_world');
    });

    it('should convert multiple words', () => {
      expect(convertCamelToSnake('helloWorldFoo')).toBe('hello_world_foo');
    });

    it('should keep already snake_case as is', () => {
      expect(convertCamelToSnake('welcome_without_args')).toBe('welcome_without_args');
    });

    it('should handle single word', () => {
      expect(convertCamelToSnake('hello')).toBe('hello');
    });

    it('should handle uppercase start', () => {
      expect(convertCamelToSnake('HelloWorld')).toBe('hello_world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single char', () => {
      expect(capitalize('h')).toBe('H');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });
});
