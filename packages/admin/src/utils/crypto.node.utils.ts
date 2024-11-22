import {BinaryLike, createHash} from 'crypto';

const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const nodeBlobSha256 = async (blob: Blob): Promise<string> =>
  nodeBufferSha256(await blobToBuffer(blob));

export const nodeUint8ArraySha256 = async (data: Uint8Array): Promise<string> =>
  nodeBufferSha256(data);

export const nodeBufferSha256 = async (data: BinaryLike): Promise<string> =>
  createHash('sha256').update(data).digest('hex');
