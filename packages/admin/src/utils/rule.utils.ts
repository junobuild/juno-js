import {fromNullable, isNullish, nonNullish, toNullable} from '@junobuild/utils';
import type {
  Permission,
  Rule as RuleApi,
  RulesType as RulesTypeApi,
  SetRule
} from '../../declarations/satellite/satellite.did';
import {
  DbRulesType,
  PermissionControllers,
  PermissionManaged,
  PermissionPrivate,
  PermissionPublic,
  StorageRulesType
} from '../constants/rules.constants';
import type {PermissionText, Rule, RulesType} from '../types/rules.types';

export const mapRuleType = (type: RulesType): RulesTypeApi =>
  type === 'storage' ? StorageRulesType : DbRulesType;

export const mapSetRule = ({
  read,
  write,
  max_size,
  updated_at
}: Pick<Rule, 'read' | 'write' | 'max_size' | 'updated_at'>): SetRule => ({
  read: permissionFromText(read),
  write: permissionFromText(write),
  updated_at: isNullish(updated_at) ? [] : [updated_at],
  max_size: toNullable(nonNullish(max_size) && max_size > 0 ? BigInt(max_size) : undefined)
});

export const mapRule = ([collection, rule]: [string, RuleApi]): Rule => {
  const {read, write, updated_at, created_at, max_size} = rule;

  const maxSize = max_size?.[0] ?? 0n > 0n ? Number(fromNullable(max_size)) : undefined;

  return {
    collection,
    read: permissionToText(read),
    write: permissionToText(write),
    updated_at,
    created_at,
    ...(nonNullish(maxSize) && {max_size: maxSize})
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
