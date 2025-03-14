import {Principal} from '@dfinity/principal';
import {jsonReplacer} from '@dfinity/utils';
import '../../polyfills/console.polyfill';

globalThis.__ic_cdk_print = vi.fn();

describe('Console', () => {
  const obj = {
    id: 546n,
    owner: Principal.anonymous(),
    array: Uint8Array.from([1, 2, 3]),
    value: 'hello'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const options = [
    {
      title: 'log',
      fn: console.log
    },
    {
      title: 'info',
      fn: console.info
    },
    {
      title: 'warn',
      fn: console.warn
    },
    {
      title: 'error',
      fn: console.error
    }
  ];

  describe.each(options)('$title', ({fn}) => {
    it('should call __ic_cdk_print', () => {
      fn('Hello', 'World');
      expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Hello World');
    });

    it('should call __ic_cdk_print with a string', () => {
      fn('Test message');
      expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Test message');
    });

    it('should stringify objects before logging', () => {
      fn({key: 'value'});
      expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('{"key":"value"}');
    });

    it('should join multiple arguments correctly', () => {
      fn('Number:', 42, {foo: 'bar'});
      expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Number: 42 {"foo":"bar"}');
    });

    it('should replace types not serializable by native stringify', () => {
      fn(obj);

      const result = JSON.stringify(obj, jsonReplacer);
      expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith(result);
    });
  });
});
