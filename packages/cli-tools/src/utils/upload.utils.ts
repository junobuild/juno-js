import {isNullish, nonNullish} from '@dfinity/utils';
import type {FileAndPaths} from '../types/deploy';

// TODO: temporary possible race condition fix until Satellite v0.0.13 is published
// We must upload the alternative path first to ensure . Friday Oct. 10 2023 I got unexpected race condition while uploading the Astro sample example (file hoisted.8961d9b1.js).
export const splitSourceFiles = (files: FileAndPaths[]): [FileAndPaths[], FileAndPaths[]] =>
  files.reduce<[FileAndPaths[], FileAndPaths[]]>(
    ([alternateFiles, sourceFiles], file) => [
      [...alternateFiles, ...(nonNullish(file.file.alternateFile) ? [file] : [])],
      [...sourceFiles, ...(isNullish(file.file.alternateFile) ? [file] : [])]
    ],
    [[], []]
  );
