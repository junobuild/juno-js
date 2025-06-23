import {JunoConsoleConfigSchema} from '../../console/console.config';

describe('console.config', () => {
  describe('JunoConsoleConfigSchema', () => {
    it('accepts minimal ConsoleId config', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: 'abc'
      });
      expect(result.success).toBe(true);
    });

    it('accepts minimal ConsoleIds config', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        ids: {
          local: 'abc',
          staging: 'def',
          production: 'ghi'
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts full config with id and CLI options', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: 'abc',
        source: 'dist',
        gzip: '*.js',
        predeploy: ['npm run build'],
        postdeploy: ['echo done']
      });
      expect(result.success).toBe(true);
    });

    it('accepts full config with ids and storage config', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        ids: {
          local: 'abc',
          production: 'xyz'
        },
        storage: {
          redirects: [
            {
              source: '/old/**',
              location: '/new',
              code: 301
            }
          ]
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects config missing both id and ids', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        source: 'dist'
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with both id and ids present', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: 'abc',
        ids: {
          local: 'def'
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with invalid gzip type', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: 'abc',
        gzip: 123
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with unknown key', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: 'abc',
        unknown: true
      });
      expect(result.success).toBe(false);
    });
  });
});
