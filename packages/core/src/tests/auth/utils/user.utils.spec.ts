import {User} from '../../../auth/types/user';
import {isGoogleUser, isWebAuthnUser} from '../../../auth/utils/user.utils';

describe('user.utils', () => {
  it('should return true for WebAuthn users', () => {
    const user = {
      data: {
        provider: 'webauthn',
        providerData: {webauthn: {aaguid: new Uint8Array(16)}}
      }
    } as unknown as User;

    expect(isWebAuthnUser(user)).toBe(true);
    expect(isGoogleUser(user)).toBe(false);
  });

  it('should return true for Google users', () => {
    const user = {
      data: {
        provider: 'google',
        providerData: {openid: {email: 'user@example.com'}}
      }
    } as unknown as User;

    expect(isGoogleUser(user)).toBe(true);
    expect(isWebAuthnUser(user)).toBe(false);
  });

  it('should return false for other providers', () => {
    const user = {
      data: {provider: 'internet_identity'}
    } as unknown as User;

    expect(isWebAuthnUser(user)).toBe(false);
    expect(isGoogleUser(user)).toBe(false);
  });

  it('should return false if provider is undefined', () => {
    const user = {data: {}} as unknown as User;

    expect(isWebAuthnUser(user)).toBe(false);
    expect(isGoogleUser(user)).toBe(false);
  });
});
