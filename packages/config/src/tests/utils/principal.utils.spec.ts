import {Principal} from '@icp-sdk/core/principal';
import {StrictPrincipalSchema, StrictPrincipalTextSchema} from '../../utils/principal.utils';
import {mockModuleIdText, mockUserIdPrincipal, mockUserIdText} from '../mocks/principal.mock';

describe('principal.utils', () => {
  describe('StrictPrincipalTextSchema', () => {
    it('accepts a valid principal string', () => {
      const result = StrictPrincipalTextSchema.safeParse(mockModuleIdText);
      expect(result.success).toBe(true);
    });

    it('rejects an invalid principal string', () => {
      const result = StrictPrincipalTextSchema.safeParse('not-a-principal');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Invalid textual representation of a Principal.'
        );
      }
    });
  });

  describe('StrictPrincipalSchema', () => {
    it('accepts a Principal instance and returns a Principal', () => {
      const res = StrictPrincipalSchema.safeParse(mockUserIdPrincipal);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(Principal.isPrincipal(res.data)).toBeTruthy();
        expect(res.data.toText()).toBe(mockUserIdText);
      }
    });

    it('rejects a principal as string text', () => {
      const res = StrictPrincipalSchema.safeParse(mockUserIdText);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toBe('Invalid Principal');
        expect(res.error.issues[0].path).toEqual([]);
      }
    });

    it('rejects null and undefined', () => {
      expect(StrictPrincipalSchema.safeParse(null).success).toBe(false);
      expect(StrictPrincipalSchema.safeParse(undefined).success).toBe(false);
    });

    it('rejects non-principal objects', () => {
      expect(StrictPrincipalSchema.safeParse({} as any).success).toBe(false);
      expect(StrictPrincipalSchema.safeParse(123 as any).success).toBe(false);
      expect(StrictPrincipalSchema.safeParse(new Uint8Array([1, 2, 3]) as any).success).toBe(false);
    });
  });
});
