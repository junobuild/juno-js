import {existsSync, mkdirSync, readdirSync, statSync, writeFileSync} from 'fs';
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

export const collectEntryPoints = () => {
  return readdirSync(join(process.cwd(), 'src'))
      .filter(
          (file) =>
              !file.includes('test') &&
              !file.includes('spec') &&
              !file.includes('mock') &&
              !file.endsWith('.swp') &&
              !file.endsWith('.worker.ts') &&
              statSync(join(process.cwd(), 'src', file)).isFile()
      )
      .map((file) => `src/${file}`);
}