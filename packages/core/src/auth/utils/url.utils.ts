export const parseOptionalUrl = ({url}: {url: string}): URL | null => {
  try {
    // Use the URL constructor, for backwards compatibility with older Android/WebView.
    return new URL(url);
  } catch (_error: unknown) {
    console.warn('Cannot parse URL. Skipping option.', {cause: url});
    return null;
  }
};
