import {fromArray, toArray} from './did.utils';

describe('did-utils', () => {
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
