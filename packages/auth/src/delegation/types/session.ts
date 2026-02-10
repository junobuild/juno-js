import type {SignedDelegation} from '@icp-sdk/core/identity';

export type UserKey = Uint8Array | number[];
export type Delegations = [UserKey, SignedDelegation[]];
