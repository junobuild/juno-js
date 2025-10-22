import {describe} from 'vitest';
import * as z from 'zod';
import {EmulatorConfigSchema} from '../../../satellite/configs/emulator.config';
import {refineEmulatorConfig} from '../../../satellite/validators/emulator.validators';

type EmulatorConfigInput = z.input<typeof EmulatorConfigSchema>;

describe('refineEmulatorConfig', () => {
  const ERR_MSG = 'nns_dapp requires: cmc, icp, nns, sns, internet_identity';
  const ERR_PATH = ['network', 'services', 'nns_dapp'];

  const runRefinement = (cfg: EmulatorConfigInput) => {
    const issues: z.core.$ZodIssue[] = [];

    const ctx: z.RefinementCtx = {
      // @ts-expect-error
      addIssue: (issue) => issues.push(issue),
      // @ts-expect-error
      path: []
    };

    refineEmulatorConfig(cfg, ctx);

    return issues;
  };
  it('returns no issues if network is omitted', () => {
    expect(runRefinement({skylab: {ports: {}}})).toHaveLength(0);
  });

  it('returns no issues if network.services is omitted', () => {
    expect(runRefinement({skylab: {ports: {}}, network: {} as any})).toHaveLength(0);
  });

  describe('skylab variant', () => {
    describe('nns_dapp', () => {
      it('fails if nns_dapp = true and cmc = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: false,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
        expect(issues[0].message).toBe(ERR_MSG);
      });

      it('fails if nns_dapp = true and icp = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: false,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and nns = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: false,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and sns = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and internet_identity = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: false
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('passes if nns_dapp = true and all required are true', () => {
        expect(
          runRefinement({
            skylab: {ports: {}},
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
          })
        ).toHaveLength(0);
      });

      it('passes if nns_dapp = false regardless of other flags', () => {
        expect(
          runRefinement({
            skylab: {ports: {}},
            network: {
              services: {
                nns_dapp: false,
                cmc: false,
                icp: false,
                nns: false,
                sns: false,
                internet_identity: false
              }
            }
          })
        ).toHaveLength(0);
      });
    });

    describe('cmc', () => {
      it('fails if cmc = true and icp = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'nns']);
        expect(issues[1].message).toBe('nns requires: icp');
      });

      it('fails if cmc = true and nns = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'nns']);
        expect(issues[0].message).toBe('nns requires: icp');
      });

      it('passes if cmc = true and icp & nns are true', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cmc = false regardless of icp/nns', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting icp/nns uses skylab defaults (true) → passes', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cmc: true}}
        });
        expect(issues).toHaveLength(0);
      });
    });
  });

  describe('console variant', () => {
    describe('nns_dapp', () => {
      it('fails if nns_dapp = true and cmc = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: false,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: false,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and nns = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: false,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and sns = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and internet_identity = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: false
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('passes if nns_dapp = true and all required are true', () => {
        expect(
          runRefinement({
            console: {ports: {}},
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
          })
        ).toHaveLength(0);
      });

      it('passes if nns_dapp = false regardless of other flags', () => {
        expect(
          runRefinement({
            console: {ports: {}},
            network: {
              services: {
                nns_dapp: false,
                cmc: false,
                icp: false,
                nns: false,
                sns: false,
                internet_identity: false
              }
            }
          })
        ).toHaveLength(0);
      });
    });

    describe('cmc', () => {
      it('fails if cmc = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'nns']);
        expect(issues[1].message).toBe('nns requires: icp');
      });

      it('fails if cmc = true and nns = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'nns']);
        expect(issues[0].message).toBe('nns requires: icp');
      });

      it('passes if cmc = true and icp & nns are true', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cmc = false regardless of icp/nns', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting icp/nns uses console defaults (true) → passes', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: true}}
        });
        expect(issues).toHaveLength(0);
      });
    });
  });

  describe('satellite variant', () => {
    describe('nns_dapp', () => {
      it('fails if nns_dapp = true and cmc = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: false,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and icp = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: false,
              nns: true,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and nns = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: false,
              sns: true,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and sns = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: false,
              internet_identity: true
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('fails if nns_dapp = true and internet_identity = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {
            services: {
              nns_dapp: true,
              cmc: true,
              icp: true,
              nns: true,
              sns: true,
              internet_identity: false
            }
          }
        });
        expect(issues[0].path).toEqual(ERR_PATH);
      });

      it('passes if nns_dapp = true and all required are true', () => {
        expect(
          runRefinement({
            satellite: {ports: {}},
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
          })
        ).toHaveLength(0);
      });

      it('passes if nns_dapp = false regardless of other flags', () => {
        expect(
          runRefinement({
            satellite: {ports: {}},
            network: {
              services: {
                nns_dapp: false,
                cmc: false,
                icp: false,
                nns: false,
                sns: false,
                internet_identity: false
              }
            }
          })
        ).toHaveLength(0);
      });
    });

    describe('cmc', () => {
      it('fails if cmc = true and icp = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'nns']);
        expect(issues[1].message).toBe('nns requires: icp');
      });

      it('fails if cmc = true and nns = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'nns']);
        expect(issues[0].message).toBe('nns requires: icp');
      });

      it('passes if cmc = true and icp & nns are true', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cmc = false regardless of icp/nns', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting nns uses satellite default (false) with cmc=true → fails', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, icp: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('omitting icp uses satellite default (true) with cmc=true → passes', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });
    });
  });
});
