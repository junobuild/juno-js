import {Principal} from '@icp-sdk/core/principal';
import {CanisterOptionsSchema} from '../../canisters';

describe('_schemas', () => {
  describe('CanisterOptionsSchema', () => {
    const mockPrincipalText = 'xlmdg-vkosz-ceopx-7wtgu-g3xmd-koiyc-awqaq-7modz-zf6r6-364rh-oqe';

    it('should accept an empty object (canisterId optional)', () => {
      expect(() => CanisterOptionsSchema.parse({})).not.toThrow();

      const parsed = CanisterOptionsSchema.parse({});
      expect(parsed).toEqual({});
    });

    it('should accept a valid Principal as canisterId', () => {
      const canisterId = Principal.fromText(mockPrincipalText);

      expect(() => CanisterOptionsSchema.parse({canisterId})).not.toThrow();

      const parsed = CanisterOptionsSchema.parse({canisterId});
      expect(parsed.canisterId?.toText()).toBe(mockPrincipalText);
    });

    it('should reject an invalid canisterId', () => {
      expect(() => CanisterOptionsSchema.parse({canisterId: 'invalid'})).toThrow();
      expect(() => CanisterOptionsSchema.parse({canisterId: 123})).toThrow();
      expect(() => CanisterOptionsSchema.parse({canisterId: Uint8Array.from([1, 2, 3])})).toThrow();
      expect(() => CanisterOptionsSchema.parse({canisterId: null})).toThrow();
    });

    it('should reject unknown properties because of strictObject', () => {
      expect(() =>
        CanisterOptionsSchema.parse({
          canisterId: Principal.fromText(mockPrincipalText),
          foo: 'bar'
        })
      ).toThrow();
    });
  });
});
