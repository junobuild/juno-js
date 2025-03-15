#!/usr/bin/env node

import {buildWebWorkers} from '../../scripts/esbuild/build-webworkers.mjs';
import {build} from '../../scripts/esbuild/build.mjs';

build();

buildWebWorkers();
