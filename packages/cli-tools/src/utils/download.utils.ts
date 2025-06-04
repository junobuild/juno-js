import {nonNullish} from '@dfinity/utils';
import {get as httpGet} from 'http';
import {get as httpsGet, type RequestOptions} from 'https';

export const downloadFromURL = async (url: string | RequestOptions): Promise<Buffer> =>
  await new Promise((resolve, reject) => {
    const protocol = typeof url === 'string' ? URL.parse(url)?.protocol : url.protocol;
    const get = protocol === 'http' ? httpGet : httpsGet;

    get(url, async (res) => {
      if (
        nonNullish(res.statusCode) &&
        nonNullish(res.headers.location) &&
        [301, 302].includes(res.statusCode)
      ) {
        await downloadFromURL(res.headers.location).then(resolve, reject);
      }

      const data: Uint8Array[] = [];

      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        resolve(Buffer.concat(data));
      });
      res.on('error', reject);
    });
  });
