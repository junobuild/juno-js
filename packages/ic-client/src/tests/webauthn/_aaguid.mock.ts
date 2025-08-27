const AAGUID_START = 37;
const AAGUID_LEN = 16;

export const makeAuthData = ({
  len,
  aaguidBytes
}: {
  len: number;
  aaguidBytes?: Uint8Array;
}): Uint8Array => {
  const buf = new Uint8Array(len);
  if (aaguidBytes && len >= AAGUID_START + AAGUID_LEN) {
    buf.set(aaguidBytes.slice(0, AAGUID_LEN), AAGUID_START);
  }
  return buf;
};

export const hexToBytes = ({aaguid}: {aaguid: string}): Uint8Array => {
  const hex = aaguid.replace(/-/g, '');
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
};
