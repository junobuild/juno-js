import {isBrowser} from '@junobuild/utils';
import {nodeBlobSha256, nodeUint8ArraySha256} from './crypto.node.utils';
import {webBlobSha256, webUint8ArraySha256} from './crypto.web.utils';

export const blobSha256 = async (data: Blob): Promise<string> => {
  const fn = isBrowser() ? webBlobSha256 : nodeBlobSha256;
  return fn(data);
};

export const uint8ArraySha256 = async (data: Uint8Array): Promise<string> => {
  const fn = isBrowser() ? webUint8ArraySha256 : nodeUint8ArraySha256;
  return fn(data);
};
