#!/usr/bin/env bash

# Copy license files to packages

function copy_license() {
  local lib=$1

  cp LICENSE packages/"$lib"
}

LIBS=utils,config,storage,core,admin,cdn,analytics,core-peer,core-standalone,core-peer,cli-tools,did-tools,config-loader,errors,functions

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  copy_license "$lib"
done