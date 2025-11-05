#!/usr/bin/env bash

function publish_npm() {
  local lib=$1

  npm publish --workspace=packages/"$lib" --provenance --access public --tag next
}

# Tips: libs use by other libs first
LIBS=utils,errors,config,ic-client,storage,auth,cdn,config-loader,cli-tools,did-tools,core,admin,analytics,core-peer,core-standalone,functions

for lib in $(echo $LIBS | sed "s/,/ /g"); do
  publish_npm "$lib"
done
