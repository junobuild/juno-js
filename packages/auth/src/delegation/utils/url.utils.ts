import {InvalidUrlError} from '../errors';

export const parseUrl = ({url}: {url: string}): URL => {
  try {
    // Use the URL constructor, for backwards compatibility with older Android/WebView.
    return new URL(url);
  } catch (_error: unknown) {
    throw new InvalidUrlError('Cannot parse authURL', {cause: url});
  }
};
