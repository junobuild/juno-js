import type {SatelliteConfig} from '@junobuild/config';
import {minimatch} from 'minimatch';
import {fullPath} from './assets.utils';
import {files} from './fs.utils';

/**
 * Scans the local source directory and returns a Set of fullPaths that are present.
 * Throws if the directory cannot be read.
 */
export const listSourceFilesForPrune = ({
  sourceAbsolutePath,
  ignore
}: {sourceAbsolutePath: string} & Required<Pick<SatelliteConfig, 'ignore'>>): Set<string> => {
  const allFiles = files(sourceAbsolutePath);
  const filteredFiles = allFiles.filter((file) => shouldBeIncluded({file, ignore}));
  return new Set(filteredFiles.map((file) => fullPath({file, sourceAbsolutePath})));
};

/**
 * Returns true if the file should be excluded based on the ignore patterns.
 */
const isIgnored = ({file, ignore}: {file: string; ignore: string[]}): boolean =>
  ignore.some((pattern) => minimatch(file, pattern, {matchBase: true}));

/**
 * Returns true if the file should be included for deletion.
 */
const shouldBeIncluded = (params: {file: string; ignore: string[]}): boolean => !isIgnored(params);
