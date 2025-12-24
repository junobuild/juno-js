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
                internet_identity: false,
                cycles: false
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
          network: {services: {cmc: true, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: true, icp: true, nns: false, cycles: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: false, icp: false, nns: false, cycles: false}}
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

    describe('cycles', () => {
      it('fails if cycles = true and cmc = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: true, cmc: false, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[0].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('fails if cycles = true and icp = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(3);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
        expect(issues[2].code).toBe('custom');
        expect(issues[2].path).toEqual(['network', 'services', 'nns']);
        expect(issues[2].message).toBe('nns requires: icp');
      });

      it('fails if cycles = true and nns = false', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('passes if cycles = true and all required (cmc, icp, nns) are true', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cycles = false regardless of cmc/icp/nns', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: false, cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting cmc/icp/nns uses skylab defaults (true) → passes', () => {
        const issues = runRefinement({
          skylab: {ports: {}},
          network: {services: {cycles: true}}
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
                internet_identity: false,
                cycles: false
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
          network: {services: {cmc: true, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: true, icp: true, nns: false, cycles: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: false, icp: false, nns: false, cycles: false}}
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

    describe('cycles', () => {
      it('fails if cycles = true and cmc = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: true, cmc: false, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[0].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('fails if cycles = true and icp = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(3);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
        expect(issues[2].code).toBe('custom');
        expect(issues[2].path).toEqual(['network', 'services', 'nns']);
        expect(issues[2].message).toBe('nns requires: icp');
      });

      it('fails if cycles = true and nns = false', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('passes if cycles = true and all required (cmc, icp, nns) are true', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cycles = false regardless of cmc/icp/nns', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: false, cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting cmc/icp/nns uses console defaults (true) → passes', () => {
        const issues = runRefinement({
          console: {ports: {}},
          network: {services: {cycles: true}}
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
                internet_identity: false,
                cycles: false
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
          network: {services: {cmc: true, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: true, icp: true, nns: false, cycles: false}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
      });

      it('fails if nns = true and icp = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: false, icp: false, nns: true, cycles: false}}
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
          network: {services: {cmc: false, icp: false, nns: false, cycles: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting nns uses satellite default (false) with cmc=true → fails', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cmc: true, icp: true, cycles: false}}
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

    describe('cycles', () => {
      it('fails if cycles = true and cmc = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, cmc: false, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[0].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('fails if cycles = true and icp = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: false, nns: true}}
        });
        expect(issues).toHaveLength(3);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
        expect(issues[2].code).toBe('custom');
        expect(issues[2].path).toEqual(['network', 'services', 'nns']);
        expect(issues[2].message).toBe('nns requires: icp');
      });

      it('fails if cycles = true and nns = false', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: false}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[0].message).toBe('cmc requires: icp, nns');
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[1].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('passes if cycles = true and all required (cmc, icp, nns) are true', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(0);
      });

      it('passes if cycles = false regardless of cmc/icp/nns', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: false, cmc: false, icp: false, nns: false}}
        });
        expect(issues).toHaveLength(0);
      });

      it('omitting cmc/nns uses satellite defaults (false) → fails', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[0].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('omitting cmc uses satellite default (false) with cycles=true → fails', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, icp: true, nns: true}}
        });
        expect(issues).toHaveLength(1);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cycles']);
        expect(issues[0].message).toBe('cycles requires: cmc, icp, nns');
      });

      it('omitting nns uses satellite default (false) with cycles=true → fails', () => {
        const issues = runRefinement({
          satellite: {ports: {}},
          network: {services: {cycles: true, cmc: true, icp: true}}
        });
        expect(issues).toHaveLength(2);
        expect(issues[0].code).toBe('custom');
        expect(issues[0].path).toEqual(['network', 'services', 'cmc']);
        expect(issues[1].code).toBe('custom');
        expect(issues[1].path).toEqual(['network', 'services', 'cycles']);
      });
    });
  });
});
