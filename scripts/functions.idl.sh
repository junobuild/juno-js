#!/usr/bin/env bash

DECLARATIONS="packages/functions/src/canisters/declarations"

function generate_idl() {
  local canister=$1
  local didfile=$2

  local didfolder="$DECLARATIONS/$canister"

  if [ ! -d "$didfolder" ]
  then
       mkdir -p "$didfolder"
  fi

  local didname
  didname="$(basename "$didfile" .did)"

  local generatedFolder="$didfolder/declarations"
  local generatedTsfile="$didname.did.d.ts"
  local generatedJsfile="$didname.did.js"

  # We have to rename the file otherwise we cannot import JavaScript.
  # Otherwise imports would always resolve on the .d.ts which is generated with similar name.
  local idlJsFile="$didname.did.idl.js"

  # --actor-disabled: skip generating actor files, since we handle those ourselves
  # --force: overwrite files. Required; otherwise, icp-bindgen would delete files at preprocess,
  # which causes issues when multiple .did files are located in the same folder.
  # --declarations-root-exports: expose generated declarations at the root of the modules.
  # Useful when the consumer encode or decode Candid messages themselves.
  npx icp-bindgen --did-file "${didfile}" --out-dir "${didfolder}" --actor-disabled --force --declarations-root-exports

  # icp-bindgen generates the files in a `declarations` subfolder
  # using a different suffix for JavaScript as the one we used to use.
  # That's why we have to post-process the results.
  mv "$generatedFolder/$generatedTsfile" "$didfolder"
  mv "$generatedFolder/$generatedJsfile" "$didfolder/$idlJsFile"
  rm -r "$generatedFolder"
}

function generate_did_idl() {
  local canister=$1

  local candid_dir="node_modules/@dfinity/${canister}/dist/candid"

  if [ ! -d "$candid_dir" ]; then
    echo "❌  No candid directory for ${canister} at ${candid_dir}"
    exit 1
  fi

  for did in "${candid_dir}"/*.did; do
    # If the glob doesn't match anything, skip
    [ -e "$did" ] || continue

    local didfile="$did"

    generate_idl "$canister" "$didfile"
  done
}

# Canisters

CANISTERS=cmc,ledger-icp,ledger-icrc,nns,sns,ic-management,ckbtc,cketh

for canister in $(echo $CANISTERS | sed "s/,/ /g")
do
    generate_did_idl "$canister"
done