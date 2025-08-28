import * as junoUtils from '@junobuild/utils';
import {popupCenter} from '../../../auth/utils/window.utils';

describe('window.utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns undefined if not in browser', () => {
    vi.spyOn(junoUtils, 'isBrowser').mockReturnValue(false);

    const result = popupCenter({width: 600, height: 400});
    expect(result).toBeUndefined();
  });

  it('returns undefined if window or window.top is nullish', () => {
    vi.spyOn(junoUtils, 'isBrowser').mockReturnValue(true);

    vi.stubGlobal('window', undefined);

    const result = popupCenter({width: 600, height: 400});
    expect(result).toBeUndefined();
  });

  it('returns correct window features string', () => {
    vi.spyOn(junoUtils, 'isBrowser').mockReturnValue(true);

    vi.stubGlobal('window', {
      top: {
        innerWidth: 1200,
        innerHeight: 800
      }
    });

    vi.stubGlobal('screenX', 100);
    vi.stubGlobal('screenY', 200);

    const result = popupCenter({width: 600, height: 400});

    expect(result).toContain('width=600');
    expect(result).toContain('height=400');
    expect(result).toContain('left=');
    expect(result).toContain('top=');
  });
});
