import {EmulatorConfigSchema} from '../../../../satellite/mainnet/configs/emulator.config';

describe('emulator.config', () => {
  describe('EmulatorConfigSchema', () => {
    const validBase = {
      runner: {
        type: 'docker',
        name: 'my-container',
        volume: 'juno',
        target: '/app/functions'
      }
    };

    it('accepts a valid Skylab config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
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
          ports: {console: 3000}
        },
        satellite: {}
      });
      expect(result.success).toBe(false);
    });

    it('accepts minimal valid Skylab config', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        skylab: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid port type in Skylab', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
          ports: {
            console: 'not-a-number'
          }
        }
      });
      expect(result.success).toBe(false);
    });

    it('accepts Satellite config with minimal fields', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        satellite: {}
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
        runner: {type: 'docker'},
        console: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects extra field in base config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {},
        extra: false
      });
      expect(result.success).toBe(false);
    });
  });
});
