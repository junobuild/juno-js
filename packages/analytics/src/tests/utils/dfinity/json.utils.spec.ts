import {jsonReplacer, jsonReviver} from '../../../utils/dfinity/json.utils';

describe('json-utils', () => {
  describe('stringify', () => {
    it('should stringify bigint with a custom representation', () => {
      expect(JSON.stringify(123n, jsonReplacer)).toEqual('{"__bigint__":"123"}');
      expect(JSON.stringify({value: 123n}, jsonReplacer)).toEqual('{"value":{"__bigint__":"123"}}');
    });
  });

  describe('parse', () => {
    it('should parse bigint from a custom representation', () => {
      expect(JSON.parse('{"__bigint__":"123"}', jsonReviver)).toEqual(123n);
      expect(JSON.parse('{"value":{"__bigint__":"123"}}', jsonReviver)).toEqual({value: 123n});
    });
  });
});
