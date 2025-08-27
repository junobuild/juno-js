/**
 * @vitest-environment jsdom
 */

import {isWebAuthnAvailable} from '../../webauthn/utils';

describe('utils', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should return false when PublicKeyCredential is undefined', async () => {
    vi.stubGlobal('PublicKeyCredential', undefined as unknown);
    await expect(isWebAuthnAvailable()).resolves.toBe(false);
  });

  it('should return false when isUserVerifyingPlatformAuthenticatorAvailable is undefined', async () => {
    vi.stubGlobal('PublicKeyCredential', {} as unknown);
    await expect(isWebAuthnAvailable()).resolves.toBe(false);
  });

  it('should return true when the platform authenticator is available', async () => {
    const spy = vi.fn().mockResolvedValue(true);
    vi.stubGlobal('PublicKeyCredential', {
      isUserVerifyingPlatformAuthenticatorAvailable: spy
    } as unknown);

    await expect(isWebAuthnAvailable()).resolves.toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return false when the platform authenticator is not available', async () => {
    const spy = vi.fn().mockResolvedValue(false);
    vi.stubGlobal('PublicKeyCredential', {
      isUserVerifyingPlatformAuthenticatorAvailable: spy
    } as unknown);

    await expect(isWebAuthnAvailable()).resolves.toBe(false);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('rejects when the availability check rejects', async () => {
    const error = new Error('some error');

    const spy = vi.fn().mockRejectedValue(error);
    vi.stubGlobal('PublicKeyCredential', {
      isUserVerifyingPlatformAuthenticatorAvailable: spy
    } as unknown);

    await expect(isWebAuthnAvailable()).rejects.toBe(error);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
