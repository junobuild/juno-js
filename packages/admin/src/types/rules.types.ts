export type PermissionText = 'public' | 'private' | 'managed' | 'controllers';

export type RulesType = 'db' | 'storage';

export interface Rule {
  collection: string;
  read: PermissionText;
  write: PermissionText;
  created_at?: bigint;
  updated_at?: bigint;
  max_size?: number;
}
