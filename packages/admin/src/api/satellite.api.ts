import type {Principal} from '@dfinity/principal';
import {toNullable} from '@junobuild/utils';
import type {_SERVICE as DeprecatedSatelliteNoScopeActor} from '../../declarations/satellite/satellite-deprecated-no-scope.did';
import type {_SERVICE as DeprecatedSatelliteActor} from '../../declarations/satellite/satellite-deprecated.did';
import type {
  Config,
  Controller,
  CustomDomain,
  Rule,
  RulesType,
  _SERVICE as SatelliteActor,
  SetRule
} from '../../declarations/satellite/satellite.did';
import type {SatelliteParameters} from '../types/actor.types';
import {
  getDeprecatedSatelliteActor,
  getDeprecatedSatelliteNoScopeActor,
  getSatelliteActor
} from './actor.api';

export const setConfig = async ({
  config,
  satellite
}: {
  config: Config;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.set_config(config);
};

export const listRules = async ({
  satellite,
  type
}: {
  satellite: SatelliteParameters;
  type: RulesType;
}): Promise<[string, Rule][]> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.list_rules(type);
};

export const setRule = async ({
  type,
  collection,
  rule,
  satellite
}: {
  type: RulesType;
  collection: string;
  rule: SetRule;
  satellite: SatelliteParameters;
}): Promise<void> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.set_rule(type, collection, rule);
};

export const version = async ({satellite}: {satellite: SatelliteParameters}): Promise<string> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);

  return actor.version();
};

// TODO: for backwards compatibility - to be removed
export const listDeprecatedControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<Principal[]> => {
  const actor: DeprecatedSatelliteActor = await getDeprecatedSatelliteActor(satellite);
  return actor.list_controllers();
};

// TODO: for backwards compatibility - to be removed
export const listDeprecatedNoScopeControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: DeprecatedSatelliteNoScopeActor =
    await getDeprecatedSatelliteNoScopeActor(satellite);
  return actor.list_controllers() as Promise<[Principal, Controller][]>;
};

export const listControllers = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[Principal, Controller][]> => {
  const actor: SatelliteActor = await getSatelliteActor(satellite);
  return actor.list_controllers();
};

export const listCustomDomains = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<[string, CustomDomain][]> => {
  const {list_custom_domains} = await getSatelliteActor(satellite);
  return list_custom_domains();
};

export const setCustomDomain = async ({
  satellite,
  domainName,
  boundaryNodesId
}: {
  satellite: SatelliteParameters;
  domainName: string;
  boundaryNodesId: string | undefined;
}): Promise<void> => {
  const {set_custom_domain} = await getSatelliteActor(satellite);
  await set_custom_domain(domainName, toNullable(boundaryNodesId));
};
