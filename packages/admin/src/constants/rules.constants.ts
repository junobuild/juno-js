import type {
  CollectionType,
  Memory,
  Permission
} from '@junobuild/ic-client/dist/declarations/satellite/satellite.did';

export const DbRulesType: CollectionType = {Db: null};
export const StorageRulesType: CollectionType = {Storage: null};

export const PermissionPublic: Permission = {Public: null};
export const PermissionPrivate: Permission = {Private: null};
export const PermissionManaged: Permission = {Managed: null};
export const PermissionControllers: Permission = {Controllers: null};

export const MemoryHeap: Memory = {Heap: null};
export const MemoryStable: Memory = {Stable: null};

export const DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS = 600_000_000n;
