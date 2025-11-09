import {join} from 'node:path';
import type {ConfigFilename} from '../types/config';

export const ts = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.ts`);
export const js = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.js`);
export const mjs = (filename: ConfigFilename): string => join(process.cwd(), `${filename}.mjs`);
