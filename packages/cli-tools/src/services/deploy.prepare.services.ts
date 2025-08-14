import {isNullish, nonNullish} from '@dfinity/utils';
import type {CliConfig, EncodingType} from '@junobuild/config';
import type {Asset} from '@junobuild/storage';
import crypto from 'crypto';
import {fileTypeFromFile} from 'file-type';
import mime from 'mime-types';
import {minimatch} from 'minimatch';
import {readFile} from 'node:fs/promises';
import {extname, join} from 'node:path';
import {
  DEPLOY_DEFAULT_ENCODING,
  DEPLOY_DEFAULT_IGNORE,
  DEPLOY_DEFAULT_PRECOMPRESS,
  DEPLOY_DEFAULT_SOURCE
} from '../constants/deploy.constants';
import type {FileDetails, FileExtension, ListAssets, PrepareDeployOptions} from '../types/deploy';
import {gzipFiles} from '../utils/compress.utils';
import {fullPath, listSourceFiles} from '../utils/deploy.utils';

export const prepareDeploy = async ({
  config,
  listAssets,
  assertSourceDirExists,
  includeAllFiles
}: {
  config: CliConfig;
  listAssets: ListAssets;
} & PrepareDeployOptions): Promise<{
  files: FileDetails[];
  sourceAbsolutePath: string;
}> => {
  const {
    source = DEPLOY_DEFAULT_SOURCE,
    ignore = DEPLOY_DEFAULT_IGNORE,
    encoding = DEPLOY_DEFAULT_ENCODING,
    precompress = DEPLOY_DEFAULT_PRECOMPRESS
  } = config;

  const sourceAbsolutePath = join(process.cwd(), source);

  assertSourceDirExists?.(sourceAbsolutePath);

  const files = await prepareFiles({
    sourceAbsolutePath,
    ignore,
    encoding,
    precompress,
    listAssets,
    includeAllFiles
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

  // Is it a new file?
  const asset = existingAssets.find(
    ({fullPath: f}) => f === fullPath({file: effectiveFilePath, sourceAbsolutePath})
  );

  if (isNullish(asset)) {
    return {file, upload: true};
  }

  // Was the file modified?
  const sha256 = await computeSha256(effectiveFilePath);

  // Previously, comparing the SHA-256 hash of Gzip and Brotli files between Node.js and Rust was inaccurate.
  // Most likely, this was because third-party plugins generate Gzip data without specifying `--no-name`,
  // which embeds the file's modified timestamp and causes hash mismatches.
  //
  // That's why, to avoid false positives, we re-upload compressed files only if their corresponding source (identity) files have changed.
  //
  // However, some files may be binary and not have an associated identity (raw) version.
  // In such cases, we fall back to comparing the hash of the available encoded version.
  return {
    file,
    upload:
      sha256 !==
      (asset.encodings.identity?.sha256 ?? asset.encodings[file.encoding ?? 'identity']?.sha256)
  };
};

const prepareFiles = async ({
  sourceAbsolutePath,
  ignore,
  encoding,
  precompress,
  listAssets,
  includeAllFiles
}: {
  sourceAbsolutePath: string;
} & {listAssets: ListAssets} & Pick<PrepareDeployOptions, 'includeAllFiles'> &
  Required<Pick<CliConfig, 'ignore' | 'encoding' | 'precompress'>>): Promise<FileDetails[]> => {
  const sourceFiles = listSourceFiles({sourceAbsolutePath, ignore});
  const compressedFiles = await gzipFiles({sourceFiles, precompress});

  const files = [...sourceFiles, ...compressedFiles.filter((file) => !sourceFiles.includes(file))];

  // TODO: brotli and zlib naive
  const mapEncodingType = ({
    file,
    ext
  }: {
    file: string;
    ext: FileExtension | undefined;
  }): EncodingType | undefined => {
    const customEncoding = encoding.find(([pattern, _]) => minimatch(file, pattern));

    if (nonNullish(customEncoding)) {
      const [_, encodingType] = customEncoding;
      return encodingType;
    }

    if (ext === 'Z') {
      return 'compress';
    }

    if (ext === 'gz') {
      return 'gzip';
    }

    if (extname(file) === '.br') {
      return 'br';
    }

    if (extname(file) === '.zlib') {
      return 'deflate';
    }

    return undefined;
  };

  const findAlternateFile = ({
    file,
    encodingType
  }: {
    file: string;
    encodingType: EncodingType | undefined;
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
      mime: typeof mimeType === 'string' ? mimeType : undefined,
      encoding: encodingType
    };
  };

  const encodingFiles: FileDetails[] = await Promise.all(files.map(mapFiles));

  // If the dev opt-out to uploading the source files that are compressed by the CLI
  const filterFilesOnReplaceMode = (): FileDetails[] => {

    console.log('-______________________>', precompress)


    if (
      typeof precompress === 'boolean' ||
      (precompress ?? DEPLOY_DEFAULT_PRECOMPRESS).mode !== 'replace'
    ) {
      return encodingFiles;
    }

    const [alternateFiles, identityFiles] = encodingFiles.reduce<[FileDetails[], FileDetails[]]>(
      ([alternateFiles, sourceFiles], file) => [
        [...alternateFiles, ...(nonNullish(file.alternateFile) ? [file] : [])],
        [...sourceFiles, ...(isNullish(file.alternateFile) ? [file] : [])]
      ],
      [[], []]
    );

    const filterIdentityFiles = identityFiles.filter(
      ({file}) => alternateFiles.find(({alternateFile}) => alternateFile === file) === undefined
    );

    return [...alternateFiles, ...filterIdentityFiles];
  };

  const filteredFiles = filterFilesOnReplaceMode();

  // TODO: to be removed
  console.log('---------------------------------->', filteredFiles);

  // juno deploy with proposals using clear
  if (includeAllFiles === true) {
    return filteredFiles;
  }

  return await filterFilesToUpload({
    files: filteredFiles,
    sourceAbsolutePath,
    listAssets
  });
};
