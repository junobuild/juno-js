import {Principal} from '@icp-sdk/core/principal';
import type {SatelliteDid} from '@junobuild/ic-client/actor';

export const mockUserDoc: SatelliteDid.Doc = {
  updated_at: 1n,
  owner: Principal.anonymous(),
  data: new Uint8Array([4, 5, 6]),
  description: [],
  created_at: 2n,
  version: []
};
