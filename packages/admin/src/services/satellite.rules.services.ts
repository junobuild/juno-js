import type {Rule, RulesType} from '@junobuild/config';
import type {SatelliteParameters} from '@junobuild/ic-client/actor';
import {listRules as listRulesApi, setRule as setRuleApi} from '../api/satellite.api';
import type {ListRulesMatcher, ListRulesResults} from '../types/list';
import {fromRule, fromRulesFilter, fromRuleType, toRule} from '../utils/rule.utils';

/**
 * Lists the rules for a satellite.
 * @param {Object} params - The parameters for listing the rules.
 * @param {RulesType} params.type - The type of rules to list.
 * @param {ListRulesMatcher} params.filter - The optional filter for the query.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<ListRulesResults>} A promise that resolves to the resolved rules.
 */
export const listRules = async ({
  type,
  satellite,
  filter
}: {
  type: RulesType;
  filter?: ListRulesMatcher;
  satellite: SatelliteParameters;
}): Promise<ListRulesResults> => {
  const {items, ...rest} = await listRulesApi({
    satellite,
    type: fromRuleType(type),
    filter: fromRulesFilter(filter)
  });

  return {
    ...rest,
    items: items.map((rule) => toRule(rule))
  };
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
}): Promise<Rule> => {
  const result = await setRuleApi({
    type: fromRuleType(type),
    rule: fromRule(rest),
    satellite,
    collection
  });

  return toRule([collection, result]);
};
