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
        gzip: '*.js',
        encoding: [['*.br', 'br']],
        predeploy: ['npm run build'],
        postdeploy: ['echo done']
      };

      const result = CliConfigSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('accepts gzip as false', () => {
      const result = CliConfigSchema.safeParse({gzip: false});
      expect(result.success).toBe(true);
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

    it('rejects invalid gzip type', () => {
      const result = CliConfigSchema.safeParse({gzip: 123});
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
