import type {CliConfig, ENCODING_TYPE} from '@junobuild/config';
import {isNullish, nonNullish} from '@junobuild/utils';
import crypto from 'crypto';
import {fileTypeFromFile, type MimeType} from 'file-type';
import {type FileExtension} from 'file-type/core';
import mime from 'mime-types';
import {minimatch} from 'minimatch';
import {readFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import {
  DEPLOY_DEFAULT_ENCODING,
  DEPLOY_DEFAULT_GZIP,
  DEPLOY_DEFAULT_IGNORE,
  DEPLOY_DEFAULT_SOURCE
} from '../constants/deploy.constants';
import type {Asset, FileDetails, ListAssets} from '../types/deploy';
import {gzipFiles} from '../utils/compress.utils';
import {fullPath, listSourceFiles} from '../utils/deploy.utils';

export const prepareDeploy = async ({
  config,
  listAssets,
  assertSourceDirExists
}: {
  config: CliConfig;
  listAssets: ListAssets;
  assertSourceDirExists?: (source: string) => void;
}): Promise<{
  files: FileDetails[];
  sourceAbsolutePath: string;
}> => {
  const {
    source = DEPLOY_DEFAULT_SOURCE,
    ignore = DEPLOY_DEFAULT_IGNORE,
    encoding = DEPLOY_DEFAULT_ENCODING,
    gzip = DEPLOY_DEFAULT_GZIP
  } = config;

  const sourceAbsolutePath = join(process.cwd(), source);

  assertSourceDirExists?.(sourceAbsolutePath);

  const files = await listFiles({
    sourceAbsolutePath,
    ignore,
    encoding,
    gzip,
    listAssets
  });

  return {
    files,
    sourceAbsolutePath
  };
};

const filterFilesToUpload = async ({
  files,
  sourceAbsolutePath,
  listAssets
}: {
  files: FileDetails[];
  sourceAbsolutePath: string;
  listAssets: ListAssets;
}): Promise<FileDetails[]> => {
  const existingAssets = await listAssets({});

  const promises = files.map(
    async (file: FileDetails) => await fileNeedUpload({file, sourceAbsolutePath, existingAssets})
  );
  const results: Array<{file: FileDetails; upload: boolean}> = await Promise.all(promises);

  return results.filter(({upload}) => upload).map(({file}) => file);
};

const computeSha256 = async (file: string): Promise<string> => {
  const buffer = await readFile(file);
  return crypto.createHash('sha256').update(buffer).digest('base64');
};

const fileNeedUpload = async ({
  file,
  existingAssets,
  sourceAbsolutePath
}: {
  file: FileDetails;
  existingAssets: Asset[];
  sourceAbsolutePath: string;
}): Promise<{
  file: FileDetails;
  upload: boolean;
}> => {
  const effectiveFilePath = file.alternateFile ?? file.file;

  const asset = existingAssets.find(
    ({fullPath: f}) => f === fullPath({file: effectiveFilePath, sourceAbsolutePath})
  );

  if (isNullish(asset)) {
    return {file, upload: true};
  }

  const sha256 = await computeSha256(effectiveFilePath);

  // TODO: current sha256 comparison (NodeJS vs Rust) with Gzip and BR is inaccurate. Therefore we re-upload compressed files only if their corresponding source files have been modified as well.
  // return {file, upload: sha256 !== asset.encodings[file.encoding ?? 'identity']?.sha256};
  // TODO: we also always assume the raw encoding is there
  return {file, upload: sha256 !== asset.encodings.identity?.sha256};
};

const listFiles = async ({
  sourceAbsolutePath,
  ignore,
  encoding,
  gzip,
  listAssets
}: {
  sourceAbsolutePath: string;
} & {listAssets: ListAssets} & Required<Pick<CliConfig, 'ignore' | 'encoding' | 'gzip'>>): Promise<
  FileDetails[]
> => {
  const sourceFiles = listSourceFiles({sourceAbsolutePath, ignore});
  const compressedFiles = await gzipFiles({sourceFiles, gzip});

  const files = [...sourceFiles, ...compressedFiles.filter((file) => !sourceFiles.includes(file))];

  // TODO: brotli and zlib naive
  const mapEncodingType = ({
    file,
    ext
  }: {
    file: string;
    ext: FileExtension | undefined;
  }): ENCODING_TYPE | undefined => {
    const customEncoding = encoding.find(([pattern, _]) => minimatch(file, pattern));

    if (nonNullish(customEncoding)) {
      const [_, encodingType] = customEncoding;
      return encodingType;
    }

    if (ext === 'Z') {
      return 'compress';
    } else if (ext === 'gz') {
      return 'gzip';
    } else if (extname(file) === '.br') {
      return 'br';
    } else if (extname(file) === '.zlib') {
      return 'deflate';
    }

    return undefined;
  };

  const findAlternateFile = ({
    file,
    encodingType
  }: {
    file: string;
    encodingType: ENCODING_TYPE | undefined;
  }): string | undefined => {
    if (isNullish(encodingType)) {
      return undefined;
    }

    return files.find((sourceFile) => sourceFile === file.replace(extname(file), ''));
  };

  const mapFiles = async (file: string): Promise<FileDetails> => {
    const fileType = await fileTypeFromFile(file);
    const encodingType = mapEncodingType({file, ext: fileType?.ext});

    // The mime-type that matters is the one of the requested file by the browser, not the mime type of the encoding
    const alternateFile = findAlternateFile({file, encodingType});

    // For some reason the library 'file-type' does not always map the mime type correctly
    const mimeType = mime.lookup(alternateFile ?? file);

    return {
      file,
      alternateFile,
      mime: typeof mimeType === 'string' ? (mimeType as MimeType) : undefined,
      encoding: encodingType
    };
  };

  const encodingFiles: FileDetails[] = await Promise.all(files.map(mapFiles));

  return await filterFilesToUpload({
    files: encodingFiles,
    sourceAbsolutePath,
    listAssets
  });
};
