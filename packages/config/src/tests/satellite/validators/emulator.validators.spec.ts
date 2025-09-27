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

  describe('console variant', () => {
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

  describe('satellite variant', () => {
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
});
