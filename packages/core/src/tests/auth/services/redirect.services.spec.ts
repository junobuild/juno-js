/**
 * @vitest-environment jsdom
 */

import {
  DelegationChain,
  DelegationIdentity,
  ECDSAKeyIdentity,
  Ed25519KeyIdentity
} from '@icp-sdk/core/identity';
import {Principal} from '@icp-sdk/core/principal';
import * as authLib from '@junobuild/auth';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {toArray} from '@junobuild/utils';
import {expect} from 'vitest';
import * as loadSvc from '../../../auth/services/load.services';
import {handleRedirectCallback} from '../../../auth/services/redirect.services';
import {AuthClientStore} from '../../../auth/stores/auth-client.store';
import {AuthStore} from '../../../auth/stores/auth.store';
import {SignInInitError} from '../../../auth/types/errors';
import {EnvStore} from '../../../core/stores/env.store';
import * as docUtils from '../../../datastore/utils/doc.utils';
import {fromDoc} from '../../../datastore/utils/doc.utils';
import {mockIdentity} from '../../mocks/core.mock';

describe('handleRedirectCallback', async () => {
  const mockUserDoc: SatelliteDid.Doc = {
    updated_at: 1n,
    owner: Principal.anonymous(),
    data: await toArray({provider: 'google', providerData: {google: {}}}),
    description: [],
    created_at: 2n,
    version: []
  };

  const mockDelegationChain = async () => {
    const createIdentity = (seed: number): Ed25519KeyIdentity => {
      const s = new Uint8Array([seed, ...new Array(31).fill(0)]);
      return Ed25519KeyIdentity.generate(s);
    };

    const root = createIdentity(2);
    const middle = createIdentity(1);

    return await DelegationChain.create(
      root,
      middle.getPublicKey(),
      new Date(Date.now() + 1_000_000),
      {
        targets: [Principal.fromText('jyi7r-7aaaa-aaaab-aaabq-cai')]
      }
    );
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    EnvStore.getInstance().reset();
  });

  it('throws if satelliteId is missing', async () => {
    await expect(handleRedirectCallback()).rejects.toThrow(SignInInitError);
  });

  it('calls authenticate with satellite params, stores session, loads user', async () => {
    EnvStore.getInstance().set({satelliteId: 'sat-123', container: true});

    const delegationChain = await mockDelegationChain();

    const sessionKey = await ECDSAKeyIdentity.generate({extractable: false});

    const authenticateSpy = vi.spyOn(authLib, 'authenticate').mockResolvedValue({
      identity: {delegationChain, sessionKey, identity: mockIdentity as DelegationIdentity},
      data: {doc: mockUserDoc}
    });

    const setStorageSpy = vi.spyOn(AuthClientStore.getInstance(), 'setAuthClientStorage');

    const fromDocSpy = vi.spyOn(docUtils, 'fromDoc');

    const loadAuthWithUserSpy = vi.spyOn(loadSvc, 'loadAuthWithUser');

    await expect(handleRedirectCallback()).resolves.toBeUndefined();

    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(authenticateSpy).toHaveBeenCalledWith({
      redirect: null,
      auth: {
        satellite: {
          satelliteId: 'sat-123',
          container: true
        }
      }
    });

    expect(setStorageSpy).toHaveBeenCalledTimes(1);
    expect(setStorageSpy).toHaveBeenCalledWith({
      delegationChain,
      sessionKey
    });

    expect(fromDocSpy).toHaveBeenCalledTimes(1);
    expect(fromDocSpy).toHaveBeenCalledWith({
      doc: mockUserDoc,
      key: mockIdentity.getPrincipal().toText()
    });

    const userFromDoc = await fromDoc({
      doc: mockUserDoc,
      key: mockIdentity.getPrincipal().toText()
    });

    expect(loadAuthWithUserSpy).toHaveBeenCalledTimes(1);
    expect(loadAuthWithUserSpy).toHaveBeenCalledWith({user: userFromDoc});

    expect(AuthStore.getInstance().get()).toStrictEqual(userFromDoc);
  });
});
