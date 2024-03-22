export type PermissionText = 'public' | 'private' | 'managed' | 'controllers';
export type MemoryText = 'heap' | 'stable';
export type RulesType = 'db' | 'storage';

export interface Rule {
  collection: string;
  read: PermissionText;
  write: PermissionText;
  memory: MemoryText;
  createdAt?: bigint;
  updatedAt?: bigint;
  maxSize?: number;
  maxCapacity?: number;
  mutablePermissions: boolean;
}
