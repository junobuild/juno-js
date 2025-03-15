import {Principal} from '@dfinity/principal';
import {jsonReplacer} from '@dfinity/utils';
import type {RawData} from '../../hooks/core';
import {decodeDocData, encodeDocData} from '../../sdk/serializer.sdk';

global.__juno_satellite_datastore_raw_data_to_text = vi.fn((data: RawData) =>
  new TextDecoder().decode(data)
);

global.__juno_satellite_datastore_raw_data_from_text = vi.fn(
  (data: string): RawData => new TextEncoder().encode(data)
);

describe('serializer.sdk', () => {
  const inputObject = {key: 'value', value: 5n, user: Principal.anonymous()};

  describe('decodeDocData', () => {
    it('should decode RawData into an object', () => {
      const inputData: RawData = new TextEncoder().encode(
        JSON.stringify(inputObject, jsonReplacer)
      );

      const result = decodeDocData<typeof inputObject>(inputData);

      expect(result).toEqual(inputObject);
      expect(global.__juno_satellite_datastore_raw_data_to_text).toHaveBeenCalledWith(inputData);
    });

    it('should decode RawData into a number', () => {
      const inputNumber = 42;
      const inputData: RawData = new TextEncoder().encode(
        JSON.stringify(inputNumber, jsonReplacer)
      );

      const result = decodeDocData<number>(inputData);

      expect(result).toBe(inputNumber);
      expect(global.__juno_satellite_datastore_raw_data_to_text).toHaveBeenCalledWith(inputData);
    });
  });

  describe('encodeDocData', () => {
    it('should encode an object into RawData', () => {
      const result = encodeDocData(inputObject);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(global.__juno_satellite_datastore_raw_data_from_text).toHaveBeenCalledWith(
        JSON.stringify(inputObject, jsonReplacer)
      );
    });

    it('should encode a number into RawData', () => {
      const inputNumber = 42;

      const result = encodeDocData(inputNumber);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(global.__juno_satellite_datastore_raw_data_from_text).toHaveBeenCalledWith('42');
    });
  });
});
