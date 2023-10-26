import {fromNullable, isNullish, nonNullish, toNullable} from '@junobuild/utils';
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
import type {MemoryText, PermissionText, Rule, RulesType} from '../types/rules.types';

export const mapRuleType = (type: RulesType): RulesTypeApi =>
  type === 'storage' ? StorageRulesType : DbRulesType;

export const mapSetRule = ({
  read,
  write,
  memory,
  max_size,
  updated_at,
  mutablePermissions
}: Pick<
  Rule,
  'read' | 'write' | 'max_size' | 'updated_at' | 'memory' | 'mutablePermissions'
>): SetRule => ({
  read: permissionFromText(read),
  write: permissionFromText(write),
  memory: nonNullish(memory) ? [memoryFromText(memory)] : [],
  updated_at: isNullish(updated_at) ? [] : [updated_at],
  max_size: toNullable(nonNullish(max_size) && max_size > 0 ? BigInt(max_size) : undefined),
  mutable_permissions: toNullable(mutablePermissions)
});

export const mapRule = ([collection, rule]: [string, RuleApi]): Rule => {
  const {read, write, updated_at, created_at, max_size, memory, mutable_permissions} = rule;

  const maxSize = max_size?.[0] ?? 0n > 0n ? Number(fromNullable(max_size)) : undefined;

  return {
    collection,
    read: permissionToText(read),
    write: permissionToText(write),
    memory: memoryToText(fromNullable(memory) ?? MemoryHeap),
    updated_at,
    created_at,
    ...(nonNullish(maxSize) && {max_size: maxSize}),
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
  switch (text) {
    case 'Stable':
      return MemoryStable;
    default:
      return MemoryHeap;
  }
};

export const memoryToText = (memory: Memory): MemoryText => {
  if ('Stable' in memory) {
    return 'Stable';
  }

  return 'Heap';
};
