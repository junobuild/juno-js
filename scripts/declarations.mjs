#!/usr/bin/env node
import {cp} from 'node:fs/promises';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';
const dest = './packages/declarations/';

await cp(src, dest, {recursive: true});
