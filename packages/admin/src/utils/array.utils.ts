// Duplicates @dfinity/utils
export const uint8ArrayToHexString = (bytes: Uint8Array | number[]) => {
  if (!(bytes instanceof Uint8Array)) {
    bytes = Uint8Array.from(bytes);
  }
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
};
