import {EmulatorConfigSchema} from '../../../satellite/configs/emulator.config';

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

    const validServices = {
      registry: true,
      cmc: true,
      icp: true,
      cycles: false,
      nns: true,
      sns: false,
      internet_identity: true,
      nns_dapp: false
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

    describe('runner type', () => {
      it('accepts runner with type docker', () => {
        const result = EmulatorConfigSchema.safeParse({
          runner: {
            type: 'docker'
          },
          console: {}
        });
        expect(result.success).toBe(true);
      });

      it('accepts runner with type podman', () => {
        const result = EmulatorConfigSchema.safeParse({
          runner: {
            type: 'podman'
          },
          console: {}
        });
        expect(result.success).toBe(true);
      });

      it('accepts runner with type container', () => {
        const result = EmulatorConfigSchema.safeParse({
          runner: {
            type: 'container'
          },
          console: {}
        });
        expect(result.success).toBe(true);
      });

      it('rejects runner with invalid type value', () => {
        const result = EmulatorConfigSchema.safeParse({
          runner: {
            type: 'unknown'
          },
          satellite: {}
        });
        expect(result.success).toBe(false);
      });
    });

    it('accepts a valid Skylab config with network services', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        network: {
          services: validServices
        },
        skylab: {
          ports: {server: 1234, admin: 5678, console: 9000}
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Console config with network services', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        network: {services: validServices},
        console: {
          ports: {server: 1111, admin: 2222}
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts a valid Satellite config with network services', () => {
      const result = EmulatorConfigSchema.safeParse({
        ...validBase,
        network: {services: validServices},
        satellite: {
          ports: {server: 7777}
        }
      });
      expect(result.success).toBe(true);
    });

    it('accepts configs without a network block', () => {
      const skylab = EmulatorConfigSchema.safeParse({
        ...validBase,
        skylab: {}
      });
      const console = EmulatorConfigSchema.safeParse({
        ...validBase,
        console: {}
      });
      const satellite = EmulatorConfigSchema.safeParse({
        ...validBase,
        satellite: {}
      });

      expect(skylab.success && console.success && satellite.success).toBe(true);
    });

    describe('network type', () => {
      it('rejects non-boolean values in network.services', () => {
        const result = EmulatorConfigSchema.safeParse({
          ...validBase,
          network: {services: {...validServices, icp: 'yes'}},
          skylab: {}
        });
        expect(result.success).toBe(false);
      });

      it('rejects unknown field under network.services', () => {
        const result = EmulatorConfigSchema.safeParse({
          ...validBase,
          network: {services: {...validServices, extraFlag: true}},
          console: {}
        });
        expect(result.success).toBe(false);
      });

      it('rejects unknown field under network', () => {
        const result = EmulatorConfigSchema.safeParse({
          ...validBase,
          network: {services: validServices, extra: 1},
          skylab: {}
        });
        expect(result.success).toBe(false);
      });

      it('rejects a network block without services', () => {
        const result = EmulatorConfigSchema.safeParse({
          ...validBase,
          network: {},
          skylab: {}
        });
        expect(result.success).toBe(false);
      });
    });
  });

  describe('refine validators', () => {
    describe('nns_dapp', () => {
      const ERR_MSG = 'nns_dapp requires: cmc, icp, nns, sns, internet_identity';

      it('skylab: fails if nns_dapp = true and sns = false', () => {
        const res = EmulatorConfigSchema.safeParse({
          skylab: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false, // <- breaks it
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('skylab: passes if all required are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          skylab: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(true);
      });

      it('console: fails if nns_dapp = true and sns = false', () => {
        const res = EmulatorConfigSchema.safeParse({
          console: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false, // <- breaks it
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('console: passes if all required are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          console: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(true);
      });

      it('satellite: fails if nns_dapp = true and sns = false', () => {
        const res = EmulatorConfigSchema.safeParse({
          satellite: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false, // <- breaks it
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('satellite: passes if all required are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          satellite: {},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(res.success).toBe(true);
      });
    });

    describe('cmc', () => {
      const ERR_MSG = 'cmc requires: icp, nns';

      it('skylab: fails if cmc = true and nns = false', () => {
        const res = EmulatorConfigSchema.safeParse({
          skylab: {},
          network: {
            services: {
              cmc: true,
              icp: true,
              nns: false // <- breaks it
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('skylab: passes if cmc = true and icp & nns are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          skylab: {},
          network: {
            services: {
              cmc: true,
              icp: true,
              nns: true
            }
          }
        });
        expect(res.success).toBe(true);
      });

      it('console: fails if cmc = true and icp = false', () => {
        const res = EmulatorConfigSchema.safeParse({
          console: {},
          network: {
            services: {
              cmc: true,
              icp: false, // <- breaks it
              nns: true
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('console: passes if cmc = true and icp & nns are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          console: {},
          network: {
            services: {
              cmc: true,
              icp: true,
              nns: true
            }
          }
        });
        expect(res.success).toBe(true);
      });

      it('satellite: fails if cmc = true and nns = false (satellite default nns=false)', () => {
        const res = EmulatorConfigSchema.safeParse({
          satellite: {},
          network: {
            services: {
              cmc: true,
              icp: true
              // nns omitted -> default false in satellite -> should fail
            }
          }
        });
        expect(res.success).toBe(false);
        if (!res.success) expect(res.error.issues[0].message).toBe(ERR_MSG);
      });

      it('satellite: passes if cmc = true and icp & nns are true', () => {
        const res = EmulatorConfigSchema.safeParse({
          satellite: {},
          network: {
            services: {
              cmc: true,
              icp: true,
              nns: true
            }
          }
        });
        expect(res.success).toBe(true);
      });
    });
  });
});
