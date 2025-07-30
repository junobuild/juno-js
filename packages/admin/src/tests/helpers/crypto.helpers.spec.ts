import {blobSha256, uint8ArraySha256} from '../../helpers/crypto.helpers';

describe('crypto.helpers', () => {
  it('should correctly hash a Blob using SHA-256', async () => {
    const data = new Uint8Array([0, 1, 2, 3, 4, 5]);
    const blob = new Blob([data]);
    const expectedHash = '17e88db187afd62c16e5debf3e6527cd006bc012bc90b51a810cd80c2d511f43';

    const hash = await blobSha256(blob);
    expect(hash).toBe(expectedHash);
  });

  it('should correctly hash a Uint8Array using SHA-256', async () => {
    const data = new Uint8Array([0, 1, 2, 3, 4, 5]);
    const expectedHash = '17e88db187afd62c16e5debf3e6527cd006bc012bc90b51a810cd80c2d511f43';

    const hash = await uint8ArraySha256(data);
    expect(hash).toBe(expectedHash);
  });
});
