import type {Memory, Permission, RulesType} from '../../declarations/satellite/satellite.did';

export const DbRulesType: RulesType = {Db: null};
export const StorageRulesType: RulesType = {Storage: null};

export const PermissionPublic: Permission = {Public: null};
export const PermissionPrivate: Permission = {Private: null};
export const PermissionManaged: Permission = {Managed: null};
export const PermissionControllers: Permission = {Controllers: null};

export const MemoryHeap: Memory = {Heap: null};

/**
 * @deprecated use newest version (V2) of the stable memory - i.e. MemoryStableV2
 */
export const MemoryStable: Memory = {Stable: null};

export const MemoryStableV2: Memory = {StableV2: null};
