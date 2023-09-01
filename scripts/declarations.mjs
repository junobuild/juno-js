#!/usr/bin/env node
import {cp, rm} from 'node:fs/promises';

const src = '/Users/daviddalbusco/projects/juno/juno/src/declarations';
const dest = [
  './packages/core/declarations/',
  './packages/admin/declarations/',
  './packages/analytics/declarations/'
];

const promises = dest.map((d) => cp(src, d, {recursive: true}));
await Promise.all(promises);

const rmPromises = dest.map(async (d) => {
  await rm(`${d}/frontend`, {recursive: true});
  await rm(`${d}/internet_identity`, {recursive: true});
  await rm(`${d}/ledger`, {recursive: true});
});
