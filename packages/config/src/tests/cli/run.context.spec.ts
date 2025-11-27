import {Principal} from '@icp-sdk/core/principal';
import {OnRun, OnRunContextSchema, OnRunSchema} from '../../cli/run.context';
import {mockIdentity} from '../mocks/identity.mock';
import {mockUserIdPrincipal} from '../mocks/principal.mock';

describe('run.context', () => {
  describe('OnRunContextSchema', () => {
    it('accepts a valid context with required fields only', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity
      });
      expect(result.success).toBe(true);
    });

    it('should not accept a container as boolean', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity,
        container: true
      });
      expect(result.success).toBe(false);
    });

    it('accepts with container as string (URL)', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity,
        container: 'http://localhost:4943'
      });
      expect(result.success).toBe(true);
    });

    it('rejects if satelliteId is missing', () => {
      const result = OnRunContextSchema.safeParse({
        identity: mockIdentity
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['satelliteId']);
      }
    });

    it('rejects if identity is missing', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['identity']);
      }
    });

    it('rejects if container is not boolean or string', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity,
        container: 123
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['container']);
      }
    });

    it('accepts a valid context with orbiterId', () => {
      const orbiterId = Principal.fromText('ot5tb-nqaaa-aaaal-ac2sa-cai');
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        orbiterId,
        identity: mockIdentity
      });
      expect(result.success).toBe(true);
    });

    it('rejects if orbiterId is not a Principal', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        orbiterId: 'not-a-principal',
        identity: mockIdentity
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['orbiterId']);
      }
    });

    it('is strict: rejects unknown keys', () => {
      const result = OnRunContextSchema.safeParse({
        satelliteId: mockUserIdPrincipal,
        identity: mockIdentity,
        extra: 'nope'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('OnRunSchema', () => {
    it('accepts a sync run function', () => {
      const onRun: OnRun = {
        run: (ctx) => {
          const parsed = OnRunContextSchema.parse(ctx);
          expect(parsed.satelliteId.toText()).toBe('2vxsx-fae');
        }
      };
      const res = OnRunSchema.safeParse(onRun);
      expect(res.success).toBe(true);
    });

    it('accepts an async run function', async () => {
      const onRun: OnRun = {
        run: async (ctx) => {
          const parsed = OnRunContextSchema.parse(ctx);
          expect(parsed.identity).toBeTruthy();
        }
      };
      const res = OnRunSchema.safeParse(onRun);
      expect(res.success).toBe(true);
    });

    it('rejects when run is not a function', () => {
      expect(() =>
        OnRunSchema.parse({
          run: 'not-a-function'
        })
      ).toThrow();
    });

    it('rejects when run is missing', () => {
      expect(() => OnRunSchema.parse({})).toThrow();
    });

    it('executes a validated run function at runtime', async () => {
      const onRun: OnRun = {
        run: async (ctx: unknown) => {
          const parsed = OnRunContextSchema.parse(ctx);
          expect(parsed.satelliteId).toBeInstanceOf(Principal);
        }
      };

      const parsed = OnRunSchema.parse(onRun);
      await parsed.run({
        satelliteId: Principal.fromText('jx5yt-yyaaa-aaaal-abzbq-cai'),
        identity: mockIdentity
      });
    });

    it('is strict: rejects unknown keys at top-level OnRun object', () => {
      const onRun: any = {
        run: () => {},
        extra: 'nope'
      };
      const res = OnRunSchema.safeParse(onRun);
      expect(res.success).toBe(false);
    });
  });
});
