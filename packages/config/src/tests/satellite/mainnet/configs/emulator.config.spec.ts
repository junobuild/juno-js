import {EmulatorConfigSchema} from '../../../../satellite/mainnet/configs/emulator.config';

describe('emulator.config', () => {
  describe('EmulatorConfigSchema', () => {
    const validBase = {
      runner: 'docker' as const,
      volume: 'juno',
      target: '/app/functions'
    };

    it('accepts a valid Skylab config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
          config: 'config.mjs',
          ports: {
            server: 1234,
            admin: 5678,
            console: 9000
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Console config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        console: {
          ports: {
            server: 1234
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Satellite config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        satellite: {
          config: 'dev.ts',
          ports: {
            admin: 4567
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing emulator variant', () => {
      const result = EmulatorConfigSchema.safeParse(validBase);
      expect(result.success).toBe(false);
    });

    it('rejects multiple emulator variants', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
          config: 'config.ts',
          ports: {console: 3000}
        },
        satellite: {
          config: 'dev.ts'
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects config with invalid file extension', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        satellite: {
          config: 'not-a-config.txt'
        }
      });
      expect(result.success).toBe(false);
    });

    it('accepts minimal valid Skylab config', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: 'docker',
        skylab: {
          config: 'conf.json'
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid port type in Skylab', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
          config: 'conf.js',
          ports: {
            console: 'not-a-number'
          }
        }
      });
      expect(result.success).toBe(false);
    });

    it('accepts Satellite config with only required fields', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: 'docker',
        satellite: {
          config: 'satellite.json'
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts Console config without console port', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        console: {
          ports: {
            server: 1234
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts minimal Console config (no ports)', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: 'docker',
        console: {}
      });
      expect(result.success).toBe(true);
    });
  });
});
