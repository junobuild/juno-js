import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';

export const DIST = join(process.cwd(), 'dist');

export const createDistFolder = () => {
  if (!existsSync(DIST)) {
    mkdirSync(DIST);
  }
};

export const writeEntries = () => {
  // an entry for the browser as default
  writeFileSync(join(DIST, 'index.js'), "export * from './browser/index.js';");
};
