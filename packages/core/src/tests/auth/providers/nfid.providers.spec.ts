/**
 * @vitest-environment jsdom
 */

import {NFIDProvider} from '../../../auth/providers/nfid.providers';

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
