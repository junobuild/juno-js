import {RawUserId} from '../../../schemas/satellite';
import {normalizeCaller} from '../../../sdk/utils/caller.utils';
import {mockUserIdPrincipal} from '../../mocks/controllers.mock';

describe('caller.utils', () => {
  describe('normalizeCaller', () => {
    it('returns the same Uint8Array if caller is already a RawUserId', () => {
      const raw: RawUserId = new Uint8Array([1, 2, 3, 4]);
      const result = normalizeCaller(raw);
      expect(result).toBe(raw);
    });

    it('converts a Principal to its Uint8Array representation', () => {
      const result = normalizeCaller(mockUserIdPrincipal);

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toEqual(mockUserIdPrincipal.toUint8Array());
    });
  });
});
