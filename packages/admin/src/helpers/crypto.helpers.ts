// Sources:
// https://stackoverflow.com/a/70891826/5404186
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest

const digestSha256 = (data: ArrayBuffer | Uint8Array<ArrayBufferLike>): Promise<ArrayBuffer> =>
  crypto.subtle.digest('SHA-256', data);

const sha256ToHex = (hashBuffer: ArrayBuffer): string => {
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const blobSha256 = async (blob: Blob): Promise<string> => {
  const hashBuffer = await digestSha256(await blob.arrayBuffer());
  return sha256ToHex(hashBuffer);
};

export const uint8ArraySha256 = async (data: Uint8Array): Promise<string> => {
  const hashBuffer = await digestSha256(data);
  return sha256ToHex(hashBuffer);
};
