import type {Precompress, SatelliteConfig} from '@junobuild/config';
import {minimatch} from 'minimatch';
import {createReadStream, createWriteStream} from 'node:fs';
import {Readable} from 'node:stream';
import {createBrotliCompress, createGunzip, createGzip} from 'node:zlib';
import {DEPLOY_DEFAULT_PRECOMPRESS} from '../constants/deploy.constants';

export const gunzipFile = async ({source}: {source: Buffer}): Promise<Buffer> =>
  await new Promise<Buffer>((resolve, reject) => {
    const sourceStream = Readable.from(source);

    const chunks: Uint8Array[] = [];

    const gzip = createGunzip();

    sourceStream.pipe(gzip);

    gzip.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    gzip.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    gzip.on('error', reject);
  });

export const compressFiles = async ({
  sourceFiles,
  precompress
}: {sourceFiles: string[]} & Required<Pick<SatelliteConfig, 'precompress'>>): Promise<string[]> => {
  if (precompress === false) {
    return [];
  }

  const pattern =
    // @ts-expect-error we read json so, it's possible that one provide a boolean that does not match the TS type
    precompress === true
      ? DEPLOY_DEFAULT_PRECOMPRESS.pattern
      : (precompress.pattern ?? DEPLOY_DEFAULT_PRECOMPRESS.pattern);

  const algorithm =
    // @ts-expect-error we read json so, it's possible that one provide a boolean that does not match the TS type
    precompress === true
      ? DEPLOY_DEFAULT_PRECOMPRESS.algorithm
      : (precompress.algorithm ?? DEPLOY_DEFAULT_PRECOMPRESS.algorithm);

  const filesToCompress = sourceFiles.filter((file) => minimatch(file, pattern));
  return await Promise.all(
    filesToCompress.map(async (source) => await compressFile({source, algorithm}))
  );
};

export const gzipFile = async (params: {source: string; destination?: string}): Promise<string> =>
  await compressFile({
    ...params,
    algorithm: 'gzip'
  });

export const brotliFile = async (params: {source: string; destination?: string}): Promise<string> =>
  await compressFile({
    ...params,
    algorithm: 'brotli'
  });

const compressFile = async ({
  source,
  algorithm,
  destination
}: {
  source: string;
  destination?: string;
} & Pick<Required<Precompress>, 'algorithm'>): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    const sourceStream = createReadStream(source);

    const destinationPath = destination ?? `${source}.${algorithm === 'brotli' ? 'br' : 'gz'}`;
    const destinationStream = createWriteStream(destinationPath);

    const compressor = algorithm === 'brotli' ? createBrotliCompress() : createGzip();

    sourceStream.pipe(compressor).pipe(destinationStream);

    destinationStream.on('close', () => {
      resolve(destinationPath);
    });
    destinationStream.on('error', reject);
  });

export const isGzip = (buffer: Buffer): boolean =>
  buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
