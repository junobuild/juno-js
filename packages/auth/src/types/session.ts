import type {SignedDelegation} from '@dfinity/identity';

export type UserKey = Uint8Array | number[];
export type Delegations = [UserKey, SignedDelegation[]];
