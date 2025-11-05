import {
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  Ed25519KeyIdentity,
  type SignedDelegation
} from '@icp-sdk/core/identity';
import {Principal} from '@icp-sdk/core/principal';
import {Delegations} from '../../types/session';
import {generateIdentity} from '../../utils/session.utils';

describe('session.utils', () => {
  describe('generateIdentity', () => {
    let sessionKey: ECDSAKeyIdentity;
    let signedDelegations: SignedDelegation[];

    const mockChain = {_tag: 'DelegationChain'} as unknown as DelegationChain;
    const mockIdentity = {_tag: 'DelegationIdentity'} as unknown as DelegationIdentity;

    beforeAll(async () => {
      sessionKey = await ECDSAKeyIdentity.generate();

      const seed = (n: number) => new Uint8Array([n, ...new Array(31).fill(0)]);
      const root = Ed25519KeyIdentity.generate(seed(2));
      const middle = Ed25519KeyIdentity.generate(seed(1));

      const chain = await DelegationChain.create(
        root,
        middle.getPublicKey(),
        new Date(Date.now() + 60_000),
        {targets: [Principal.fromText('jyi7r-7aaaa-aaaab-aaabq-cai')]}
      );

      signedDelegations = chain.delegations;
    });

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.spyOn(DelegationChain, 'fromDelegations').mockReturnValue(mockChain);
      vi.spyOn(DelegationIdentity, 'fromDelegation').mockReturnValue(mockIdentity);
    });

    it('should create identity from Uint8Array userKey and wires constructors with correct args', () => {
      const userKey = new Uint8Array([1, 2, 3, 4]);
      const delegations: Delegations = [userKey, signedDelegations];

      const result = generateIdentity({delegations, sessionKey});

      expect(DelegationChain.fromDelegations).toHaveBeenCalledTimes(1);
      const [delegArg, pubKeyArg] = vi.mocked(DelegationChain.fromDelegations).mock.calls[0];

      expect(delegArg).toBe(signedDelegations);
      expect(pubKeyArg).toBeInstanceOf(Uint8Array);
      expect(Array.from(pubKeyArg as Uint8Array)).toEqual(Array.from(userKey));

      expect(DelegationIdentity.fromDelegation).toHaveBeenCalledTimes(1);
      expect(DelegationIdentity.fromDelegation).toHaveBeenCalledWith(sessionKey, mockChain);

      expect(result).toEqual({identity: mockIdentity, delegationChain: mockChain, sessionKey});
    });

    it('creates identity from number[] userKey', () => {
      const userKey = [5, 6, 7, 8];
      const delegations: Delegations = [userKey, signedDelegations];

      generateIdentity({delegations, sessionKey});

      const [, pubKeyArg] = vi.mocked(DelegationChain.fromDelegations).mock.calls[0];
      expect(pubKeyArg).toBeInstanceOf(Uint8Array);
      expect(Array.from(pubKeyArg)).toEqual(userKey);
    });

    it('bubbles errors from DelegationIdentity.fromDelegation', () => {
      const userKey = new Uint8Array([9]);
      const delegations: Delegations = [userKey, signedDelegations];

      const err = new Error();
      vi.mocked(DelegationIdentity.fromDelegation).mockImplementationOnce(() => {
        throw err;
      });

      expect(() => generateIdentity({delegations, sessionKey})).toThrow(err);
    });
  });
});
