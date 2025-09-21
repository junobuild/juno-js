/**
 * @vitest-environment jsdom
 */

import {InternetIdentityProvider} from '../../../auth/providers/internet-identity.providers';
import {
  DOCKER_CONTAINER_URL,
  DOCKER_INTERNET_IDENTITY_ID
} from '../../../core/constants/container.constants';
import {EnvStore} from '../../../core/stores/env.store';
import {mockSatelliteId} from '../../mocks/core.mock';

describe('internet-identity.providers', () => {
  beforeEach(() => {
    EnvStore.getInstance().reset();
  });

  const expectedWindowOpenerFeatures =
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=576, height=576, top=96, left=224';

  it('returns default identityProvider', () => {
    const provider = new InternetIdentityProvider({});

    const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: true});
    expect(provider.id).toBe('internet_identity');
    expect(identityProvider).toBe('https://identity.internetcomputer.org');
    expect(windowOpenerFeatures).toEqual(expectedWindowOpenerFeatures);
  });

  it('returns identityProvider for internetcomputer.org', () => {
    const provider = new InternetIdentityProvider({
      domain: 'internetcomputer.org'
    });

    const {identityProvider} = provider.signInOptions({});
    expect(provider.id).toBe('internet_identity');
    expect(identityProvider).toBe('https://identity.internetcomputer.org');
  });

  it('returns identityProvider for ic0.app', () => {
    const provider = new InternetIdentityProvider({domain: 'ic0.app'});

    const {identityProvider, windowOpenerFeatures} = provider.signInOptions({windowed: true});

    expect(provider.id).toBe('internet_identity');
    expect(identityProvider).toBe('https://identity.ic0.app');
    expect(windowOpenerFeatures).toEqual(expectedWindowOpenerFeatures);
  });

  it('returns identityProvider for id.ai', () => {
    const provider = new InternetIdentityProvider({
      domain: 'id.ai'
    });

    const {identityProvider} = provider.signInOptions({});
    expect(provider.id).toBe('internet_identity');
    expect(identityProvider).toBe('https://id.ai');
  });

  it('returns identityProvider for without suffix for custom domain', () => {
    const provider = new InternetIdentityProvider({
      domain: 'yolo.com' as 'id.ai'
    });

    const {identityProvider} = provider.signInOptions({});
    expect(provider.id).toBe('internet_identity');
    expect(identityProvider).toBe('https://yolo.com');
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
