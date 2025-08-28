export const sha256ToBase64String = (sha256: Iterable<number>): string =>
  btoa([...sha256].map((c) => String.fromCharCode(c)).join(''));
