import {Principal} from '@icp-sdk/core/principal';
import {IcrcCanisterOptionsSchema} from '../../../../canisters/ledger/icrc';

describe('schemas', () => {
  describe('IcrcCanisterOptionsSchema', () => {
    const mockPrincipalText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';

    it('should NOT accept an empty object (canisterId required)', () => {
      expect(() => IcrcCanisterOptionsSchema.parse({})).toThrow();
    });

    it('should accept a valid Principal as canisterId', () => {
      const canisterId = Principal.fromText(mockPrincipalText);

      expect(() => IcrcCanisterOptionsSchema.parse({canisterId})).not.toThrow();

      const parsed = IcrcCanisterOptionsSchema.parse({canisterId});
      expect(parsed.canisterId.toText()).toBe(mockPrincipalText);
    });

    it('should reject a missing canisterId', () => {
      // Slightly redundant with the empty object test, but makes intent explicit
      expect(() => IcrcCanisterOptionsSchema.parse({})).toThrow();
    });

    it('should reject an invalid canisterId', () => {
      expect(() => IcrcCanisterOptionsSchema.parse({canisterId: 'invalid'})).toThrow();
      expect(() => IcrcCanisterOptionsSchema.parse({canisterId: 123})).toThrow();
      expect(() =>
        IcrcCanisterOptionsSchema.parse({canisterId: Uint8Array.from([1, 2, 3])})
      ).toThrow();
      expect(() => IcrcCanisterOptionsSchema.parse({canisterId: null})).toThrow();
    });

    it('should reject unknown properties because of strictObject', () => {
      expect(() =>
        IcrcCanisterOptionsSchema.parse({
          canisterId: Principal.fromText(mockPrincipalText),
          foo: 'bar'
        })
      ).toThrow();
    });
  });
});
