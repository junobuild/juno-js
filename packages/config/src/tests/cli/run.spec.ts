import {defineRun, RunFnOrObjectSchema} from '../../cli/run';
import {OnRunContextSchema, OnRunSchema} from '../../cli/run.context';
import {mockIdentity} from '../mocks/identity.mock';
import {mockUserIdPrincipal} from '../mocks/principal.mock';

describe('run', () => {
  const validOnRunObj = {
    run: (_ctx: unknown) => {}
  };

  describe('RunFnOrObjectSchema', () => {
    it('accepts an OnRun object', () => {
      const res = RunFnOrObjectSchema.safeParse(validOnRunObj);
      expect(res.success).toBe(true);

      if (res.success) {
        expect(OnRunSchema.safeParse(res.data).success).toBe(true);
      }
    });

    it('accepts a function returning a valid OnRun object', () => {
      const fn = (_env: unknown) => validOnRunObj;
      const res = RunFnOrObjectSchema.safeParse(fn);
      expect(res.success).toBe(true);
    });

    it('throws when input is not a function nor a valid OnRun object', () => {
      expect(() => RunFnOrObjectSchema.parse('nope')).toThrow();
    });

    it('runtime: call the function form and validate the returned OnRun', async () => {
      const fn = (_env: unknown) => ({
        run: async (ctx: unknown) => {
          const parsed = OnRunContextSchema.parse(ctx);
          expect(parsed.satelliteId.toText()).toBe(mockUserIdPrincipal.toText());
        }
      });

      const parsedUnion = RunFnOrObjectSchema.parse(fn);
      const onRun = (parsedUnion as typeof fn)({});

      const valid = OnRunSchema.parse(onRun);

      await valid.run({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity
      });
    });
  });

  describe('defineRun', () => {
    it('returns the same OnRun object reference', () => {
      const res = defineRun(validOnRunObj);
      expect(res).toBe(validOnRunObj);
      expect(OnRunSchema.safeParse(res).success).toBe(true);
    });

    it('returns the same function reference', () => {
      const fn = (_env: unknown) => validOnRunObj;
      const res = defineRun(fn);
      expect(res).toBe(fn);
    });
  });
});
