import '../../polyfills/console.polyfill';

globalThis.__ic_cdk_print = vi.fn();

describe('Console', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call __ic_cdk_print when console.info is used', () => {
        console.info('Hello', 'World');
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Hello World');
    });

    it('should call __ic_cdk_print when console.log is used', () => {
        console.log('Test message');
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Test message');
    });

    it('should call __ic_cdk_print when console.warn is used', () => {
        console.warn('Warning message');
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Warning message');
    });

    it('should call __ic_cdk_print when console.error is used', () => {
        console.error('Error message');
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Error message');
    });

    it('should stringify objects before logging', () => {
        console.log({ key: 'value' });
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('{"key":"value"}');
    });

    it('should join multiple arguments correctly', () => {
        console.log('Number:', 42, { foo: 'bar' });
        expect(globalThis.__ic_cdk_print).toHaveBeenCalledWith('Number: 42 {"foo":"bar"}');
    });
});
