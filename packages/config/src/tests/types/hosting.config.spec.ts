import {HostingConfig, HostingConfigSchema} from '../../types/hosting.config';

describe('hosting.config', () => {
  describe('HostingConfigSchema', () => {
    it('rejects an empty object (source is required)', () => {
      const result = HostingConfigSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('accepts a minimal valid config', () => {
      const result = HostingConfigSchema.safeParse({source: 'dist'});
      expect(result.success).toBe(true);
    });

    it('accepts a full valid config', () => {
      const config: HostingConfig = {
        source: 'dist',
        ignore: ['**/*.test.js'],
        precompress: {
          pattern: '**/*.+(css|js|mjs|html)',
          mode: 'both',
          algorithm: 'gzip'
        },
        encoding: [['*.br', 'br']],
        predeploy: ['npm run build'],
        postdeploy: ['echo done']
      };

      const result = HostingConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    describe('precompress', () => {
      it('accepts precompress as false (opt-out)', () => {
        const result = HostingConfigSchema.safeParse({source: 'dist', precompress: false});
        expect(result.success).toBe(true);
      });

      it('accepts precompress mode replace', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: {mode: 'replace'}
        });
        expect(result.success).toBe(true);
      });

      it('rejects invalid precompress.mode', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: {mode: 'off'}
        });
        expect(result.success).toBe(false);
      });

      it('rejects invalid precompress.algorithm', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: {algorithm: 'br'}
        });
        expect(result.success).toBe(false);
      });

      it('accepts precompress.algorithm brotli', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: {algorithm: 'brotli'}
        });
        expect(result.success).toBe(true);
      });

      it('rejects precompress if not an object or false', () => {
        const result = HostingConfigSchema.safeParse({source: 'dist', precompress: 123});
        expect(result.success).toBe(false);
      });

      it('rejects precompress.pattern if not a string', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: {pattern: 123}
        });
        expect(result.success).toBe(false);
      });

      it('accepts precompress as an array of valid objects', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: [
            {pattern: '**/*.js', mode: 'both', algorithm: 'gzip'},
            {pattern: '**/*.css', mode: 'replace', algorithm: 'brotli'}
          ]
        });
        expect(result.success).toBe(true);
      });

      it('rejects precompress array if one entry is invalid', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: [
            {pattern: '**/*.js', mode: 'replace', algorithm: 'gzip'},
            {pattern: '**/*.css', mode: 'invalid'}
          ]
        });
        expect(result.success).toBe(false);
      });

      it('rejects precompress array if not an array of objects', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: [123, 'not-an-object']
        });
        expect(result.success).toBe(false);
      });

      it('accepts precompress array with minimal valid object', () => {
        const result = HostingConfigSchema.safeParse({
          source: 'dist',
          precompress: [{mode: 'replace'}]
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid encoding values', () => {
      const result = HostingConfigSchema.safeParse({
        source: 'dist',
        encoding: [['*.zip', 'zip']]
      });
      expect(result.success).toBe(false);
    });

    it('rejects encoding if not tuple of [string, EncodingType]', () => {
      const result = HostingConfigSchema.safeParse({
        source: 'dist',
        encoding: [['*.br']]
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown keys due to strict schema', () => {
      const result = HostingConfigSchema.safeParse({
        source: 'dist',
        somethingUnexpected: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects predeploy if not array', () => {
      const result = HostingConfigSchema.safeParse({
        source: 'dist',
        predeploy: 'npm run build'
      });
      expect(result.success).toBe(false);
    });

    it('rejects postdeploy if array includes non-strings', () => {
      const result = HostingConfigSchema.safeParse({
        source: 'dist',
        postdeploy: ['echo', 123]
      });
      expect(result.success).toBe(false);
    });
  });
});
