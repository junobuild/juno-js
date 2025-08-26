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
import {compressFiles} from '../utils/compress.utils';
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

  const {encoding, file: fileToUpload} = file;

  const sha256 = await computeSha256(fileToUpload);

  // Previously or originally, comparing the SHA-256 hash of Gzip and Brotli files between Node.js and Rust was unreliable.
  // This was most likely because some third-party tools generate Gzip data without `--no-name`,
  // embedding the file's modified timestamp and causing hash mismatches.
  //
  // Nowadays, the recommended way to compress files is by using the CLI, which produces reproducible output
  // thanks to Node.js >= v20.
  //
  // In addition, some files are binary and have no meaningful uncompressed "identity" form
  // (for example, woff2 fonts).
  //
  // For this reason, we always compare the hash of the actual file being uploaded -
  // whether compressed or not - together with its encoding, or fall back to identity when needed.

  return {
    file,
    upload: sha256 !== asset.encodings[encoding ?? 'identity']?.sha256
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

  const allCompressedFiles = await compressFiles({sourceFiles, precompress});
  const compressedFiles = allCompressedFiles.filter(
    ({compressed}) => !sourceFiles.includes(compressed)
  );

  const uncompressedFiles = sourceFiles.filter(
    (source) =>
      compressedFiles.find(({source: sourceCompressed}) => sourceCompressed === source) ===
      undefined
  );

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

    if (extname(file).toLowerCase() === '.br') {
      return 'br';
    }

    if (extname(file).toLowerCase() === '.zlib') {
      return 'deflate';
    }

    return undefined;
  };

  const mapFiles = async ({
    file,
    alternateFile
  }: Pick<FileDetails, 'file' | 'alternateFile'>): Promise<FileDetails> => {
    const fileType = await fileTypeFromFile(file);
    const encodingType = mapEncodingType({file, ext: fileType?.ext});

    // For some reason the library 'file-type' does not always map the mime type correctly
    const mimeType = mime.lookup(alternateFile ?? file);

    return {
      file,
      alternateFile,
      mime: typeof mimeType === 'string' ? mimeType : undefined,
      encoding: encodingType
    };
  };

  const uncompressedFilesDetails = await Promise.all(
    uncompressedFiles.map(async (file) => await mapFiles({file}))
  );

  const mapBothFiles = async ({
    source,
    compressed
  }: {
    source: string;
    compressed: string;
  }): Promise<FileDetails[]> => {
    const mapCompressedFile = async () => await mapFiles({file: compressed, alternateFile: source});
    const mapSourceFile = async () => await mapFiles({file: source});

    return await Promise.all([mapCompressedFile(), mapSourceFile()]);
  };

  const mapReplaceFile = async ({
    compressed,
    source
  }: {
    source: string;
    compressed: string;
  }): Promise<FileDetails> => {
    const mapCompressedFile = async () => await mapFiles({file: compressed, alternateFile: source});
    return await mapCompressedFile();
  };

  const bothCompressedFilesDetails = await Promise.all(
    compressedFiles
      .filter(({mode}) => mode === 'both')
      .map(async ({source, compressed}) => await mapBothFiles({source, compressed}))
  );

  const replaceCompressedFilesDetails = await Promise.all(
    compressedFiles
      .filter(({mode}) => mode === 'replace')
      .map(async ({source, compressed}) => await mapReplaceFile({source, compressed}))
  );

  // Note: The CLI does not currently check for duplicate source files across patterns.
  // For example, if a developer defines overlapping patterns in both "replace" and "both" modes
  // that reference the same file, it may appear multiple times in the list.
  // In this case, the last uploaded compressed version takes precedence, and both the source
  // and compressed files may still be uploaded.
  // In the future, we may add assertions to prevent this scenario. For now, responsibility
  // is left to developers using multiple pre-compression strategies — which is likely rare.
  const files = [
    ...replaceCompressedFilesDetails,
    ...bothCompressedFilesDetails.flatMap((files) => files),
    ...uncompressedFilesDetails
  ];

  // juno deploy with proposals using clear
  if (includeAllFiles === true) {
    return files;
  }

  return await filterFilesToUpload({
    files,
    sourceAbsolutePath,
    listAssets
  });
};
