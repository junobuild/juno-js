#!/usr/bin/env bash

# Copy license files to packages

function copy_license() {
  local lib=$1

  cp LICENSE packages/"$lib"
}

LIBS=utils,config,storage,core,admin,console,analytics,core-peer,cli-tools,did-tools,config-loader

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  copy_license "$lib"
done