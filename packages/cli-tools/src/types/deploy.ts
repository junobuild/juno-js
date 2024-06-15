import type {ENCODING_TYPE} from '@junobuild/config';
import type {MimeType} from 'file-type';

export interface FileDetails {
  file: string;
  // e.g. for index.js.gz -> index.js
  alternateFile?: string;
  encoding?: ENCODING_TYPE;
  mime?: MimeType;
}
