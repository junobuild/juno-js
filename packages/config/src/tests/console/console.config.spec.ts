import {JunoConsoleConfigSchema} from '../../console/console.config';
import {mockModuleIdText} from '../mocks/principal.mock';

describe('console.config', () => {
  describe('JunoConsoleConfigSchema', () => {
    it('accepts minimal ConsoleId config', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: mockModuleIdText
      });
      expect(result.success).toBe(true);
    });

    it('accepts minimal ConsoleIds config', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        ids: {
          development: mockModuleIdText,
          production: mockModuleIdText,
          staging: mockModuleIdText
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts full config with id and CLI options', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: mockModuleIdText,
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
          local: mockModuleIdText,
          production: mockModuleIdText
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

    it('rejects config with neither id nor ids', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        someBaseField: 'value'
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with both id and ids present', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: mockModuleIdText,
        ids: {
          local: mockModuleIdText
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with invalid principal id', () => {
      const config = {
        id: 'invalid-principal'
      };

      expect(() => JunoConsoleConfigSchema.parse(config)).toThrow();
    });

    it('rejects config with invalid principal in ids', () => {
      const config = {
        ids: {
          development: 'invalid',
          production: mockModuleIdText
        }
      };

      expect(() => JunoConsoleConfigSchema.parse(config)).toThrow();
    });

    it('rejects config with invalid gzip type', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: mockModuleIdText,
        gzip: 123
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with unknown key', () => {
      const result = JunoConsoleConfigSchema.safeParse({
        id: mockModuleIdText,
        unknown: true
      });
      expect(result.success).toBe(false);
    });
  });
});
