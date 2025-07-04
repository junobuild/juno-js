import {JunoConfigSchema} from '../../../satellite/mainnet/juno.config';
import {mockModuleIdText} from '../../mocks/principal.mocks';

describe('juno.config', () => {
  describe('JunoConfigSchema', () => {
    it('accepts valid satellite config with SatelliteId', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          id: mockModuleIdText
        }
      });

      expect(result.success).toBe(true);
    });

    it('accepts valid satellite config with SatelliteIds', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          ids: {
            production: mockModuleIdText,
            staging: mockModuleIdText
          }
        }
      });

      expect(result.success).toBe(true);
    });

    it('accepts valid satellite + orbiter config', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          id: mockModuleIdText
        },
        orbiter: {
          id: mockModuleIdText
        }
      });

      expect(result.success).toBe(true);
    });

    it('rejects when satellite is missing', () => {
      const result = JunoConfigSchema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['satellite']);
      }
    });

    it('rejects when satellite config is invalid', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {
          foo: 'bar'
        }
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });

    it('accepts valid skylab emulator config', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {id: mockModuleIdText},
        emulator: {
          runner: {
            type: 'docker',
            volume: 'my-volume',
            target: './functions'
          },
          skylab: {
            ports: {
              server: 1111,
              admin: 2222,
              console: 5866
            }
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid console emulator config', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {id: mockModuleIdText},
        emulator: {
          runner: {
            type: 'docker'
          },
          console: {
            ports: {
              server: 1234,
              admin: 5678
            }
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid satellite emulator config', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {id: mockModuleIdText},
        emulator: {
          runner: {
            type: 'docker'
          },
          satellite: {
            ports: {
              server: 1000
            }
          }
        }
      });
      expect(result.success).toBe(true);
    });

    it('rejects emulator config with multiple emulator types', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {id: mockModuleIdText},
        emulator: {
          runner: {
            type: 'docker'
          },
          skylab: {ports: {console: 5866}},
          console: {}
        }
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_union');
      }
    });

    it('rejects emulator config with invalid runner', () => {
      const result = JunoConfigSchema.safeParse({
        satellite: {id: mockModuleIdText},
        emulator: {
          runner: {
            type: 'something'
          },
          console: {}
        }
      });

      expect(result.success).toBe(false);
    });
  });
});
