import {fromNullable, isNullish, nonNullish, toNullable} from '@dfinity/utils';
import type {MemoryText, PermissionText, Rule, RulesType} from '@junobuild/config';
import type {SatelliteDid} from '@junobuild/ic-client/actor';
import {
  DbRulesType,
  DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS,
  MemoryHeap,
  MemoryStable,
  PermissionControllers,
  PermissionManaged,
  PermissionPrivate,
  PermissionPublic,
  StorageRulesType
} from '../constants/rules.constants';
import type {ListRulesMatcher} from '../types/list';

export const fromRuleType = (type: RulesType): SatelliteDid.CollectionType =>
  type === 'storage' ? StorageRulesType : DbRulesType;

export const fromRulesFilter = (filter?: ListRulesMatcher): SatelliteDid.ListRulesParams => ({
  matcher: isNullish(filter)
    ? toNullable()
    : toNullable({
        include_system: filter.include_system
      })
});

export const fromRule = ({
  read,
  write,
  memory,
  maxSize,
  maxChangesPerUser,
  maxCapacity,
  version,
  mutablePermissions,
  maxTokens
}: Pick<
  Rule,
  | 'read'
  | 'write'
  | 'maxSize'
  | 'maxChangesPerUser'
  | 'maxCapacity'
  | 'version'
  | 'memory'
  | 'mutablePermissions'
  | 'maxTokens'
>): SatelliteDid.SetRule => ({
  read: permissionFromText(read),
  write: permissionFromText(write),
  memory: nonNullish(memory) ? [memoryFromText(memory)] : [],
  version: toNullable(version),
  max_size: toNullable(nonNullish(maxSize) && maxSize > 0n ? maxSize : undefined),
  max_capacity: toNullable(nonNullish(maxCapacity) && maxCapacity > 0 ? maxCapacity : undefined),
  max_changes_per_user: toNullable(
    nonNullish(maxChangesPerUser) && maxChangesPerUser > 0 ? maxChangesPerUser : undefined
  ),
  mutable_permissions: toNullable(mutablePermissions ?? true),
  rate_config:
    nonNullish(maxTokens) && maxTokens > 0n
      ? [
          {
            max_tokens: maxTokens,
            time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
          }
        ]
      : []
});

export const toRule = ([collection, rule]: [string, SatelliteDid.Rule]): Rule => {
  const {
    read,
    write,
    updated_at,
    created_at,
    max_size,
    max_changes_per_user,
    max_capacity,
    memory,
    mutable_permissions,
    version,
    rate_config
  } = rule;

  const maxSize = (max_size?.[0] ?? 0n > 0n) ? fromNullable(max_size) : undefined;
  const maxChangesPerUser =
    (max_changes_per_user?.[0] ?? 0 > 0) ? fromNullable(max_changes_per_user) : undefined;
  const maxCapacity = (max_capacity?.[0] ?? 0 > 0) ? fromNullable(max_capacity) : undefined;

  const ruleVersion = fromNullable(version);

  const maxTokens =
    (rate_config?.[0]?.max_tokens ?? 0n > 0n) ? fromNullable(rate_config)?.max_tokens : undefined;

  return {
    collection,
    read: permissionToText(read),
    write: permissionToText(write),
    memory: memoryToText(fromNullable(memory) ?? MemoryHeap),
    updatedAt: updated_at,
    createdAt: created_at,
    ...(nonNullish(ruleVersion) && {version: ruleVersion}),
    ...(nonNullish(maxChangesPerUser) && {maxChangesPerUser}),
    ...(nonNullish(maxSize) && {maxSize}),
    ...(nonNullish(maxCapacity) && {maxCapacity}),
    mutablePermissions: fromNullable(mutable_permissions) ?? true,
    ...(nonNullish(maxTokens) && {maxTokens})
  };
};

export const permissionToText = (permission: SatelliteDid.Permission): PermissionText => {
  if ('Public' in permission) {
    return 'public';
  }

  if ('Private' in permission) {
    return 'private';
  }

  if ('Managed' in permission) {
    return 'managed';
  }

  return 'controllers';
};

const permissionFromText = (text: PermissionText): SatelliteDid.Permission => {
  switch (text) {
    case 'public':
      return PermissionPublic;
    case 'private':
      return PermissionPrivate;
    case 'managed':
      return PermissionManaged;
    default:
      return PermissionControllers;
  }
};

export const memoryFromText = (text: MemoryText): SatelliteDid.Memory => {
  switch (text.toLowerCase()) {
    case 'heap':
      return MemoryHeap;
    default:
      return MemoryStable;
  }
};

export const memoryToText = (memory: SatelliteDid.Memory): MemoryText => {
  if ('Heap' in memory) {
    return 'heap';
  }

  return 'stable';
};
