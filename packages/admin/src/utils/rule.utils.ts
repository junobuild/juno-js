import {fromNullable, nonNullish, toNullable} from '@dfinity/utils';
import type {MemoryText, PermissionText, Rule, RulesType} from '@junobuild/config';
import type {
  Memory,
  Permission,
  Rule as RuleApi,
  RulesType as RulesTypeApi,
  SetRule
} from '../../declarations/satellite/satellite.did';
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

export const mapRuleType = (type: RulesType): RulesTypeApi =>
  type === 'storage' ? StorageRulesType : DbRulesType;

export const mapSetRule = ({
  read,
  write,
  memory,
  maxSize,
  maxCapacity,
  version,
  mutablePermissions,
  maxTokens
}: Pick<
  Rule,
  | 'read'
  | 'write'
  | 'maxSize'
  | 'maxCapacity'
  | 'version'
  | 'memory'
  | 'mutablePermissions'
  | 'maxTokens'
>): SetRule => ({
  read: permissionFromText(read),
  write: permissionFromText(write),
  memory: nonNullish(memory) ? [memoryFromText(memory)] : [],
  version: toNullable(version),
  max_size: toNullable(nonNullish(maxSize) && maxSize > 0 ? BigInt(maxSize) : undefined),
  max_capacity: toNullable(nonNullish(maxCapacity) && maxCapacity > 0 ? maxCapacity : undefined),
  mutable_permissions: toNullable(mutablePermissions),
  rate_config: nonNullish(maxTokens)
    ? [
        {
          max_tokens: BigInt(maxTokens),
          time_per_token_ns: DEFAULT_RATE_CONFIG_TIME_PER_TOKEN_NS
        }
      ]
    : []
});

export const mapRule = ([collection, rule]: [string, RuleApi]): Rule => {
  const {
    read,
    write,
    updated_at,
    created_at,
    max_size,
    max_capacity,
    memory,
    mutable_permissions,
    version,
    rate_config
  } = rule;

  const maxSize = (max_size?.[0] ?? 0n > 0n) ? Number(fromNullable(max_size)) : undefined;
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
    ...(nonNullish(maxSize) && {maxSize}),
    ...(nonNullish(maxCapacity) && {maxCapacity}),
    mutablePermissions: fromNullable(mutable_permissions) ?? true,
    ...(nonNullish(maxTokens) && {maxTokens: Number(maxTokens)})
  };
};

export const permissionToText = (permission: Permission): PermissionText => {
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

const permissionFromText = (text: PermissionText): Permission => {
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

export const memoryFromText = (text: MemoryText): Memory => {
  switch (text.toLowerCase()) {
    case 'heap':
      return MemoryHeap;
    default:
      return MemoryStable;
  }
};

export const memoryToText = (memory: Memory): MemoryText => {
  if ('Heap' in memory) {
    return 'heap';
  }

  return 'stable';
};
