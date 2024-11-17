import {lstatSync, readdirSync} from 'node:fs';
import {access} from 'node:fs/promises';
import {join} from 'node:path';

export const files = (source: string): string[] =>
  readdirSync(source).flatMap((file) => {
    const path = join(source, file);
    return lstatSync(path).isDirectory() ? files(path) : join(path);
  });

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    } 
      throw err;
    
  }
};
