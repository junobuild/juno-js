import type {SatelliteConfig} from '@junobuild/config';
import {minimatch} from 'minimatch';
import {lstatSync} from 'node:fs';
import {basename} from 'node:path';
import {IGNORE_OS_FILES} from '../constants/deploy.constants';
import {files} from './fs.utils';

export const fullPath = ({
  file,
  sourceAbsolutePath
}: {
  file: string;
  sourceAbsolutePath: string;
}): string => file.replace(sourceAbsolutePath, '').replace(/\\/g, '/');

export const listSourceFiles = ({
  sourceAbsolutePath,
  ignore
}: {sourceAbsolutePath: string} & Required<Pick<SatelliteConfig, 'ignore'>>): string[] => {
  const sourceFiles = files(sourceAbsolutePath);

  return sourceFiles.filter((file) => filterFile({file, ignore}));
};

const filterFile = ({
  file,
  ignore
}: {file: string} & Required<Pick<SatelliteConfig, 'ignore'>>): boolean => {
  // File must not be empty >= 0kb
  if (lstatSync(file).size <= 0) {
    return false;
  }

  // Ignore .DS_Store on Mac or Thumbs.db on Windows
  if (IGNORE_OS_FILES.includes(basename(file).toLowerCase())) {
    return false;
  }

  return ignore.find((pattern) => minimatch(file, pattern)) === undefined;
};
