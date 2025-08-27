/**
 * @vitest-environment jsdom
 */

import {PUBLIC_KEY_COSE_ALGORITHMS} from '../../webauthn/_constants';
import {createPasskeyOptions, retrievePasskeyOptions} from '../../webauthn/_options';
import {WebAuthnIdentityHostnameError} from '../../webauthn/errors';

describe('_options', () => {
  const originalTitle = document.title;

  beforeEach(() => {
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      href: 'https://app.example.com/welcome'
    });

    document.title = 'Hello World';
  });

  afterAll(() => {
    vi.unstubAllGlobals();
    document.title = originalTitle;
  });

  describe('createPasskeyOptions', () => {
    it('should provide default options to create passkey', () => {
      const opts = createPasskeyOptions({});

      expect(opts.attestation).toBe('direct');

      expect(opts.challenge).toBeInstanceOf(Uint8Array);
      expect(opts.challenge as Uint8Array).toHaveLength(16);

      expect(opts.rp?.id).toBe('app.example.com');
      expect(opts.rp?.name).toBe('Hello World');

      expect(opts.user.id).toBeInstanceOf(Uint8Array);
      expect(opts.user.id as Uint8Array).toHaveLength(16);
      expect(opts.user.name).toBe('Hello World');
      expect(opts.user.displayName).toBe('Hello World');

      const algs = opts.pubKeyCredParams.map((p) => p.alg);
      const expectedAlgs = Object.values(PUBLIC_KEY_COSE_ALGORITHMS);
      expect(algs).toEqual(expectedAlgs);
      expect(opts.pubKeyCredParams.every((p) => p.type === 'public-key')).toBe(true);

      expect(opts.excludeCredentials).toEqual([]);
      expect(opts.authenticatorSelection).toEqual({
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        residentKey: 'required',
        requireResidentKey: true
      });
    });

    it('should set the passkey as discoverable', () => {
      const opts = createPasskeyOptions({});

      expect(opts.authenticatorSelection?.residentKey).toEqual('required');
      expect(opts.authenticatorSelection?.requireResidentKey === true).toBeTruthy();
    });

    it('should use appId to override relying party default values', () => {
      const opts = createPasskeyOptions({
        appId: {id: 'mydomain.com', name: 'My app'}
      });

      expect(opts.rp?.id).toBe('mydomain.com');
      expect(opts.rp?.name).toBe('My app');
    });

    it('should use user fields', () => {
      const both = createPasskeyOptions({
        user: {displayName: 'Maria Sanchez', name: 'maria@example.com'}
      });

      expect(both.user.displayName).toBe('Maria Sanchez');
      expect(both.user.name).toBe('maria@example.com');

      const onlyDisplay = createPasskeyOptions({
        user: {displayName: 'Alex Chen'}
      });

      expect(onlyDisplay.user.displayName).toBe('Alex Chen');
      expect(onlyDisplay.user.name).toBe('Alex Chen');
    });

    it('should throws WebAuthnHostnameError when URL.parse fails', () => {
      const spy = vi
        .spyOn(URL as unknown as {parse(href: string): URL | null}, 'parse')
        .mockReturnValue(null as unknown as URL);

      expect(() => createPasskeyOptions({})).toThrow(WebAuthnIdentityHostnameError);

      spy.mockRestore();
    });
  });

  describe('retrievePasskeyOptions', () => {
    it('should provide default options to retrieve passkey', () => {
      const opts = retrievePasskeyOptions({});

      expect(opts).toEqual({
        rpId: 'app.example.com',
        allowCredentials: [],
        userVerification: 'required'
      });
    });

    it('should uses appId.id override for rpId', () => {
      const opts = retrievePasskeyOptions({appId: {id: 'myapp.com'}});
      expect(opts.rpId).toBe('myapp.com');
    });

    it('throws WebAuthnHostnameError when URL.parse fails', () => {
      const spy = vi
        .spyOn(URL as unknown as {parse(href: string): URL | null}, 'parse')
        .mockReturnValue(null as unknown as URL);

      expect(() => retrievePasskeyOptions({})).toThrow(WebAuthnIdentityHostnameError);

      spy.mockRestore();
    });
  });
});
