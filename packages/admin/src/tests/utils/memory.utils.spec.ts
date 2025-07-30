import {fromMaxMemorySize, toMaxMemorySize} from '../../utils/memory.utils';

describe('memory.utils', () => {
  describe('toMaxMemorySize', () => {
    it('returns [] when input is undefined', () => {
      expect(toMaxMemorySize(undefined)).toEqual([]);
    });

    it('returns heap and stable wrapped when both are defined', () => {
      expect(toMaxMemorySize({heap: 100n, stable: 200n})).toEqual([
        {
          heap: [100n],
          stable: [200n]
        }
      ]);
    });

    it('returns only stable if heap is undefined', () => {
      expect(toMaxMemorySize({stable: 123n})).toEqual([
        {
          heap: [],
          stable: [123n]
        }
      ]);
    });

    it('returns only heap if stable is undefined', () => {
      expect(toMaxMemorySize({heap: 456n})).toEqual([
        {
          heap: [456n],
          stable: []
        }
      ]);
    });
  });

  describe('fromMaxMemorySize', () => {
    it('returns empty object if input is []', () => {
      expect(fromMaxMemorySize([])).toEqual({});
    });

    it('returns maxMemorySize with heap and stable when both are present', () => {
      expect(
        fromMaxMemorySize([
          {
            heap: [100n],
            stable: [200n]
          }
        ])
      ).toEqual({
        maxMemorySize: {
          heap: 100n,
          stable: 200n
        }
      });
    });

    it('returns only stable if heap is empty', () => {
      expect(
        fromMaxMemorySize([
          {
            heap: [],
            stable: [300n]
          }
        ])
      ).toEqual({
        maxMemorySize: {
          stable: 300n
        }
      });
    });

    it('returns only heap if stable is empty', () => {
      expect(
        fromMaxMemorySize([
          {
            heap: [400n],
            stable: []
          }
        ])
      ).toEqual({
        maxMemorySize: {
          heap: 400n
        }
      });
    });

    it('returns empty object if heap and stable are both empty', () => {
      expect(
        fromMaxMemorySize([
          {
            heap: [],
            stable: []
          }
        ])
      ).toEqual({});
    });
  });
});
