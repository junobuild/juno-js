/**
 * @vitest-environment jsdom
 */

import {DelegationChain, ECDSAKeyIdentity} from '@icp-sdk/core/identity';
import * as devIdentity from '@junobuild/ic-client/dev';
import type {Mock} from 'vitest';
import {DevIdentityProvider} from '../../../auth/providers/dev-identity.providers';

const {
  UnsafeDevIdentityInvalidIdentifierError,
  UnsafeDevIdentityNotBrowserError,
  UnsafeDevIdentityNotLocalhostError
} = devIdentity;

describe('dev-identity.providers', () => {
  let mockSessionKey: ECDSAKeyIdentity;
  let mockDelegationChain: DelegationChain;

  let mockInitAuth: Mock;
  let mockSetStorage: Mock;

  beforeEach(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hostname: 'localhost'
    });

    mockSessionKey = {} as ECDSAKeyIdentity;
    mockDelegationChain = {} as DelegationChain;

    mockInitAuth = vi.fn().mockResolvedValue(undefined);
    mockSetStorage = vi.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('generates dev identity and calls setStorage and initAuth', async () => {
    const generateSpy = vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockResolvedValue({
      identity: {} as any,
      sessionKey: mockSessionKey,
      delegationChain: mockDelegationChain
    });

    const provider = new DevIdentityProvider();
    await provider.signIn({
      options: {},
      initAuth: mockInitAuth,
      setStorage: mockSetStorage
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledWith({});

    expect(mockSetStorage).toHaveBeenCalledTimes(1);
    expect(mockSetStorage).toHaveBeenCalledWith({
      sessionKey: mockSessionKey,
      delegationChain: mockDelegationChain
    });

    expect(mockInitAuth).toHaveBeenCalledTimes(1);
    expect(mockInitAuth).toHaveBeenCalledWith({provider: undefined});
  });

  it('passes custom identifier to generateUnsafeDevIdentity', async () => {
    const generateSpy = vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockResolvedValue({
      identity: {} as any,
      sessionKey: mockSessionKey,
      delegationChain: mockDelegationChain
    });

    const provider = new DevIdentityProvider();
    await provider.signIn({
      options: {identifier: 'alice'},
      initAuth: mockInitAuth,
      setStorage: mockSetStorage
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledWith({identifier: 'alice'});
  });

  it('passes custom maxTimeToLive to generateUnsafeDevIdentity', async () => {
    const generateSpy = vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockResolvedValue({
      identity: {} as any,
      sessionKey: mockSessionKey,
      delegationChain: mockDelegationChain
    });

    const oneDay = 24 * 60 * 60 * 1000;

    const provider = new DevIdentityProvider();
    await provider.signIn({
      options: {maxTimeToLiveInMilliseconds: oneDay},
      initAuth: mockInitAuth,
      setStorage: mockSetStorage
    });

    expect(generateSpy).toHaveBeenCalledTimes(1);
    expect(generateSpy).toHaveBeenCalledWith({maxTimeToLiveInMilliseconds: oneDay});
  });

  it('throws when not in browser environment', async () => {
    vi.stubGlobal('window', undefined);

    vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockRejectedValue(
      new UnsafeDevIdentityNotBrowserError()
    );

    const provider = new DevIdentityProvider();

    await expect(
      provider.signIn({
        options: {},
        initAuth: mockInitAuth,
        setStorage: mockSetStorage
      })
    ).rejects.toThrow(UnsafeDevIdentityNotBrowserError);
  });

  it('throws when hostname is not localhost', async () => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      hostname: 'production.example.com'
    });

    vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockRejectedValue(
      new UnsafeDevIdentityNotLocalhostError()
    );

    const provider = new DevIdentityProvider();

    await expect(
      provider.signIn({
        options: {},
        initAuth: mockInitAuth,
        setStorage: mockSetStorage
      })
    ).rejects.toThrow(UnsafeDevIdentityNotLocalhostError);
  });

  it('throws when identifier exceeds 32 characters', async () => {
    const longIdentifier = 'this-is-a-very-long-identifier-that-exceeds-32-characters';

    vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockRejectedValue(
      new UnsafeDevIdentityInvalidIdentifierError(longIdentifier.length)
    );

    const provider = new DevIdentityProvider();

    await expect(
      provider.signIn({
        options: {identifier: longIdentifier},
        initAuth: mockInitAuth,
        setStorage: mockSetStorage
      })
    ).rejects.toThrow(UnsafeDevIdentityInvalidIdentifierError);
  });

  it('executes operations in correct order', async () => {
    const order: string[] = [];

    vi.spyOn(devIdentity, 'generateUnsafeDevIdentity').mockImplementation(async () => {
      order.push('generate');
      return {
        identity: {} as any,
        sessionKey: mockSessionKey,
        delegationChain: mockDelegationChain
      };
    });

    mockSetStorage.mockImplementation(async () => {
      order.push('setStorage');
    });

    mockInitAuth.mockImplementation(async () => {
      order.push('initAuth');
    });

    const provider = new DevIdentityProvider();
    await provider.signIn({
      options: {},
      initAuth: mockInitAuth,
      setStorage: mockSetStorage
    });

    expect(order).toEqual(['generate', 'setStorage', 'initAuth']);
  });
});
