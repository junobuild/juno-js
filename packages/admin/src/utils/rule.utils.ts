import type {MemoryText, PermissionText, Rule, RulesType} from '@junobuild/config';
import {fromNullable, nonNullish, toNullable} from '@junobuild/utils';
import type {
  Memory,
  Permission,
  Rule as RuleApi,
  RulesType as RulesTypeApi,
  SetRule
} from '../../declarations/satellite/satellite.did';
import {
  DbRulesType,
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
  mutablePermissions
}: Pick<
  Rule,
  'read' | 'write' | 'maxSize' | 'maxCapacity' | 'version' | 'memory' | 'mutablePermissions'
>): SetRule => ({
  read: permissionFromText(read),
  write: permissionFromText(write),
  memory: nonNullish(memory) ? [memoryFromText(memory)] : [],
  version: toNullable(version),
  max_size: toNullable(nonNullish(maxSize) && maxSize > 0 ? BigInt(maxSize) : undefined),
  max_capacity: toNullable(nonNullish(maxCapacity) && maxCapacity > 0 ? maxCapacity : undefined),
  mutable_permissions: toNullable(mutablePermissions),
  // TODO: support for rate config
  rate_config: []
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
    version
  } = rule;

  const maxSize = (max_size?.[0] ?? 0n > 0n) ? Number(fromNullable(max_size)) : undefined;
  const maxCapacity = (max_capacity?.[0] ?? 0 > 0) ? fromNullable(max_capacity) : undefined;

  const ruleVersion = fromNullable(version);

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
    mutablePermissions: fromNullable(mutable_permissions) ?? true
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
