#!/usr/bin/env node
import {cp} from 'node:fs/promises';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';
const dest = ['./packages/core/declarations/', './packages/admin/declarations/'];

const promises = dest.map((d) => cp(src, d, {recursive: true}));
await Promise.all(promises);
