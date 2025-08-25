import {CliConfig, CliConfigSchema} from '../../types/cli.config';

describe('cli.config', () => {
  describe('CliConfigSchema', () => {
    it('accepts an empty object (all optional)', () => {
      const result = CliConfigSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('accepts a full valid config', () => {
      const config: CliConfig = {
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

      const result = CliConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    describe('precompress', () => {
      it('accepts precompress as false (opt-out)', () => {
        const result = CliConfigSchema.safeParse({precompress: false});
        expect(result.success).toBe(true);
      });

      it('accepts precompress mode replace', () => {
        const result = CliConfigSchema.safeParse({
          precompress: {
            mode: 'replace'
          }
        });
        expect(result.success).toBe(true);
      });

      it('rejects invalid precompress.mode', () => {
        const result = CliConfigSchema.safeParse({
          precompress: {mode: 'off'}
        });
        expect(result.success).toBe(false);
      });

      it('rejects invalid precompress.algorithm', () => {
        const result = CliConfigSchema.safeParse({
          precompress: {algorithm: 'br'}
        });
        expect(result.success).toBe(false);
      });

      it('accept precompress.algorithm brotli', () => {
        const result = CliConfigSchema.safeParse({
          precompress: {algorithm: 'brotli'}
        });
        expect(result.success).toBe(true);
      });

      it('rejects precompress if not an object or false', () => {
        const result = CliConfigSchema.safeParse({precompress: 123});
        expect(result.success).toBe(false);
      });

      it('rejects precompress.pattern if not a string', () => {
        const result = CliConfigSchema.safeParse({
          precompress: {pattern: 123}
        });
        expect(result.success).toBe(false);
      });

      it('accepts precompress as an array of valid objects', () => {
        const result = CliConfigSchema.safeParse({
          precompress: [
            {pattern: '**/*.js', mode: 'both', algorithm: 'gzip'},
            {pattern: '**/*.css', mode: 'replace', algorithm: 'brotli'}
          ]
        });
        expect(result.success).toBe(true);
      });

      it('rejects precompress array if one entry is invalid', () => {
        const result = CliConfigSchema.safeParse({
          precompress: [
            {pattern: '**/*.js', mode: 'replace', algorithm: 'gzip'},
            {pattern: '**/*.css', mode: 'invalid'} // ❌ invalid
          ]
        });
        expect(result.success).toBe(false);
      });

      it('rejects precompress array if not an array of objects', () => {
        const result = CliConfigSchema.safeParse({
          precompress: [123, 'not-an-object']
        });
        expect(result.success).toBe(false);
      });

      it('accepts precompress array with minimal valid object', () => {
        const result = CliConfigSchema.safeParse({
          precompress: [{mode: 'replace'}]
        });
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid encoding values', () => {
      const result = CliConfigSchema.safeParse({
        encoding: [['*.zip', 'zip']]
      });
      expect(result.success).toBe(false);
    });

    it('rejects encoding if not tuple of [string, EncodingType]', () => {
      const result = CliConfigSchema.safeParse({
        encoding: [['*.br']]
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown keys due to strict schema', () => {
      const result = CliConfigSchema.safeParse({
        somethingUnexpected: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid precompress type', () => {
      const result = CliConfigSchema.safeParse({precompress: 123});
      expect(result.success).toBe(false);
    });

    it('rejects predeploy if not array', () => {
      const result = CliConfigSchema.safeParse({predeploy: 'npm run build'});
      expect(result.success).toBe(false);
    });

    it('rejects postdeploy if array includes non-strings', () => {
      const result = CliConfigSchema.safeParse({postdeploy: ['echo', 123]});
      expect(result.success).toBe(false);
    });
  });
});
