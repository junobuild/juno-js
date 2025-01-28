import {nonNullish} from '@dfinity/utils';
import {get, type RequestOptions} from 'https';

export const downloadFromURL = async (url: string | RequestOptions): Promise<Buffer> =>
  await new Promise((resolve, reject) => {
    get(url, async (res) => {
      if (nonNullish(res.statusCode) && [301, 302].includes(res.statusCode)) {
        await downloadFromURL(res.headers.location!).then(resolve, reject);
      }

      const data: Uint8Array[] = [];

      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
      res.on('error', reject);
    });
  });
