/**
 * @vitest-environment jsdom
 */

import {
  InternetIdentityProvider,
  NFIDProvider
} from '../../../auth/providers/auth-client.providers';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_INTERNET_IDENTITY_ID
} from '../../../core/constants/container.constants';
import {EnvStore} from '../../../core/stores/env.store';
import {mockSatelliteId} from '../../mocks/core.mock';

describe('auth.providers', () => {
  beforeEach(() => {
    EnvStore.getInstance().reset();
  });

  describe('InternetIdentityProvider', () => {
    const expectedWindowOpenerFeatures =
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=576, height=576, top=96, left=224';

    it('returns default identityProvider', () => {
      const provider = new InternetIdentityProvider({});

      const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: true});
      expect(provider.id).toBe('internet_identity');
      expect(identityProvider).toBe('https://identity.internetcomputer.org');
      expect(windowOpenerFeatures).toEqual(expectedWindowOpenerFeatures);
    });

    it('returns default identityProvider for domain', () => {
      const provider = new InternetIdentityProvider({domain: 'ic0.app'});

      const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: true});

      expect(provider.id).toBe('internet_identity');
      expect(identityProvider).toBe('https://identity.ic0.app');
      expect(windowOpenerFeatures).toEqual(expectedWindowOpenerFeatures);
    });

    it('returns container URL with docker default', () => {
      EnvStore.getInstance().set({satelliteId: mockSatelliteId, container: true});

      const provider = new InternetIdentityProvider({});
      const {identityProvider} = provider.signInOptions({windowed: true});

      expect(identityProvider).toContain(DOCKER_CONTAINER_URL.split('//')[1]);
      expect(identityProvider).toContain(`canisterId=${DOCKER_INTERNET_IDENTITY_ID}`);
    });

    it('respects custom internetIdentityId', () => {
      EnvStore.getInstance().set({
        satelliteId: mockSatelliteId,
        container: true,
        internetIdentityId: 'rrkah-fqaaa-aaaaa-aaaaq-cai'
      });

      const provider = new InternetIdentityProvider({});
      const {identityProvider} = provider.signInOptions({windowed: true});

      expect(identityProvider).toContain(`canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai`);
    });

    it('returns only identityProvider if windowed is false', () => {
      const provider = new InternetIdentityProvider({});

      const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: false});

      expect(identityProvider).toMatch(/^https:\/\/identity\./);
      expect(windowOpenerFeatures).toBeUndefined();
    });
  });

  describe('NFIDProvider', () => {
    const appName = 'Test App';
    const logoUrl = 'https://example.com/logo.png';

    const expectedWindowOpenerFeatures =
      'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=505, height=705, top=31.5, left=259.5';

    it('returns signInOptions with encoded parameters', () => {
      const provider = new NFIDProvider({appName, logoUrl});

      const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: true});

      expect(provider.id).toBe('nfid');
      expect(identityProvider).toEqual(
        'https://nfid.one/authenticate/?applicationName=Test%20App&applicationLogo=https://example.com/logo.png'
      );
      expect(windowOpenerFeatures).toEqual(expectedWindowOpenerFeatures);
    });

    it('returns identityProvider only if windowed is false', () => {
      const provider = new NFIDProvider({appName, logoUrl});

      const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: false});

      expect(identityProvider).toContain(encodeURIComponent(appName));
      expect(windowOpenerFeatures).toBeUndefined();
    });
  });
});
