import {NullishError} from './asserts.utils';
import {
  fromArray,
  fromDefinedNullable,
  fromNullable,
  fromNullishNullable,
  toArray,
  toNullable
} from './did.utils';

describe('did-utils', () => {
  const test = {test: '1'};

  describe('fromNullable', () => {
    it('should convert from empty array to undefined', () => {
      expect(fromNullable([])).toBeUndefined();
    });

    it('should convert from array to object', () => {
      expect(fromNullable([{test: '1'}])).toEqual(test);
    });
  });

  describe('toNullable', () => {
    it('should convert from undefined to empty array', () => {
      expect(toNullable(undefined)).toEqual([]);
    });

    it('should convert from null to empty array', () => {
      expect(toNullable(null)).toEqual([]);
    });

    it('should convert object to array', () => {
      const test = {test: '1'};
      expect(toNullable(test)).toEqual([test]);
    });

    it('should convert boolean to array', () => {
      const test = false;
      expect(toNullable(test)).toEqual([test]);
    });

    it('should convert null to empty array', () => {
      const test = null;
      expect(toNullable(test)).toEqual([]);
    });

    it('should convert 0 to array', () => {
      const test = 0;
      expect(toNullable(test)).toEqual([test]);
    });
  });

  describe('fromDefinedNullable', () => {
    it('should convert from array to object', () => {
      expect(fromDefinedNullable([{test: '1'}])).toEqual(test);
    });

    it('should throw on undefined', () => {
      expect(() => fromDefinedNullable([])).toThrow(NullishError);
    });
  });

  describe('fromNullishNullable', () => {
    it('should return undefined for an empty array', () => {
      expect(fromNullishNullable([])).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(fromNullishNullable(undefined)).toBeUndefined();
    });

    it('should return the value for a non-empty array', () => {
      expect(fromNullishNullable([{test: '1'}])).toEqual(test);
    });

    it('should return undefined when the array contains undefined', () => {
      expect(fromNullishNullable([undefined])).toBeUndefined();
    });
  });

  describe('toArray', () => {
    it('should convert a simple object to Uint8Array', async () => {
      const data = {key: 'value'};
      const result = await toArray(data);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(new TextDecoder().decode(result)).toContain('key');
      expect(new TextDecoder().decode(result)).toContain('value');
    });

    it('should convert a number to Uint8Array', async () => {
      const data = 42;
      const result = await toArray(data);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(new TextDecoder().decode(result)).toContain('42');
    });

    it('should convert a string to Uint8Array', async () => {
      const data = 'hello world';
      const result = await toArray(data);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(new TextDecoder().decode(result)).toContain('hello world');
    });

    it('should convert an array to Uint8Array', async () => {
      const data = [1, 2, 3];
      const result = await toArray(data);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(new TextDecoder().decode(result)).toContain('[1,2,3]');
    });

    it('should convert null to Uint8Array', async () => {
      const data = null;
      const result = await toArray(data);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(new TextDecoder().decode(result)).toContain('null');
    });
  });

  describe('fromArray', () => {
    it('should convert a Uint8Array back to the original object', async () => {
      const data = {key: 'value'};
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });

    it('should convert a Uint8Array back to the original number', async () => {
      const data = 42;
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });

    it('should convert a Uint8Array back to the original string', async () => {
      const data = 'hello world';
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });

    it('should convert a Uint8Array back to the original array', async () => {
      const data = [1, 2, 3];
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });

    it('should convert a Uint8Array back to null', async () => {
      const data = null;
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });
  });

  describe('toArray and fromArray integration', () => {
    it('should maintain data integrity for complex objects', async () => {
      const data = {key: 'value', array: [1, 2, 3], nested: {innerKey: 'innerValue'}};
      const array = await toArray(data);
      const result = await fromArray(array);
      expect(result).toEqual(data);
    });
  });
});
