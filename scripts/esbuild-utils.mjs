import {existsSync, mkdirSync} from 'fs';
import {join} from 'path';

export const DIST = join(process.cwd(), 'dist');

export const createDistFolder = () => {
  if (!existsSync(DIST)) {
    mkdirSync(DIST);
  }
};
