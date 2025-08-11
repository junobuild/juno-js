import type {SatelliteDid} from '@junobuild/ic-client';

export const DbRulesType: SatelliteDid.CollectionType = {Db: null};
export const StorageRulesType: SatelliteDid.CollectionType = {Storage: null};

export const PermissionPublic: SatelliteDid.Permission = {Public: null};
export const PermissionPrivate: SatelliteDid.Permission = {Private: null};
export const PermissionManaged: SatelliteDid.Permission = {Managed: null};
export const PermissionControllers: SatelliteDid.Permission = {Controllers: null};

export const MemoryHeap: SatelliteDid.Memory = {Heap: null};
export const MemoryStable: SatelliteDid.Memory = {Stable: null};

export const DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS = 600_000_000n;
