export const encodeFilename = (filename: string): string =>
  encodeURI(filename.toLowerCase().replace(/\s/g, '-'));
