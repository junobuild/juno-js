import type {Rule, RulesType} from '@junobuild/config';
import {listRules as listRulesApi, setRule as setRuleApi} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import {mapRule, mapRuleType, mapSetRule} from '../utils/rule.utils';

/**
 * Lists the rules for a satellite.
 * @param {Object} params - The parameters for listing the rules.
 * @param {RulesType} params.type - The type of rules to list.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<Rule[]>} A promise that resolves to an array of rules.
 */
export const listRules = async ({
  type,
  satellite
}: {
  type: RulesType;
  satellite: SatelliteParameters;
}): Promise<Rule[]> => {
  const rules = await listRulesApi({
    satellite,
    type: mapRuleType(type)
  });

  return rules.map((rule) => mapRule(rule));
};

/**
 * Sets a rule for a satellite.
 * @param {Object} params - The parameters for setting the rule.
 * @param {Rule} params.rule - The rule to set.
 * @param {RulesType} params.type - The type of rule.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<void>} A promise that resolves when the rule is set.
 */
export const setRule = async ({
  rule: {collection, ...rest},
  type,
  satellite
}: {
  rule: Rule;
  type: RulesType;
  satellite: SatelliteParameters;
}): Promise<void> => {
  await setRuleApi({
    type: mapRuleType(type),
    rule: mapSetRule(rest),
    satellite,
    collection
  });
};
