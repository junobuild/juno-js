#!/usr/bin/env node

import {buildWebWorkers} from '../../scripts/esbuild-webworkers.mjs';
import {build} from '../../scripts/esbuild.mjs';

build();

buildWebWorkers();
