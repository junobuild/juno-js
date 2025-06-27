import {StrictPrincipalTextSchema} from '../../utils/principal.utils';
import {mockModuleIdText} from '../mocks/principal.mocks';

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
});
