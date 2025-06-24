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

    it('accepts a minimal Skylab config', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        skylab: {}
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Console config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        console: {
          ports: {
            server: 1111,
            admin: 2222
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a minimal Console config (no ports)', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        console: {}
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Satellite config', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        satellite: {
          ports: {
            server: 7777
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a minimal Satellite config', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        satellite: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects config with no emulator variant', () => {
      const result = EmulatorConfigSchema.safeParse(validBase);
      expect(result.success).toBe(false);
    });

    it('rejects config with multiple emulator variants', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {},
        console: {}
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid port type', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {
          ports: {
            server: 'abc' // invalid type
          }
        }
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown field at top level', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {},
        unknownField: true
      });
      expect(result.success).toBe(false);
    });

    it('rejects unknown field in emulator block', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {type: 'docker'},
        console: {
          ports: {},
          extra: 'nope'
        }
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid Skylab config without runner', () => {
      const result = EmulatorConfigSchema.safeParse({
        skylab: {
          ports: {
            server: 1234,
            console: 5866
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid Satellite config without runner', () => {
      const result = EmulatorConfigSchema.safeParse({
        satellite: {
          ports: {
            admin: 5999
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid Console config without runner', () => {
      const result = EmulatorConfigSchema.safeParse({
        console: {
          ports: {
            server: 1111
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts runner with platform "linux/amd64"', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {
          type: 'docker',
          platform: 'linux/amd64'
        },
        skylab: {}
      });
      expect(result.success).toBe(true);
    });

    it('accepts runner with platform "linux/arm64"', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {
          type: 'docker',
          platform: 'linux/arm64'
        },
        console: {}
      });
      expect(result.success).toBe(true);
    });

    it('rejects runner with invalid platform value', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {
          type: 'docker',
          platform: 'windows/amd64'
        },
        satellite: {}
      });
      expect(result.success).toBe(false);
    });

    it('rejects runner with non-string platform value', () => {
      const result = EmulatorConfigSchema.safeParse({
        runner: {
          type: 'docker',
          platform: 123
        },
        skylab: {}
      });
      expect(result.success).toBe(false);
    });
  });
});
