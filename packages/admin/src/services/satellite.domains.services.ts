import {fromNullable, nonNullish} from '@junobuild/utils';
import {
  listCustomDomains as listCustomDomainsApi,
  setCustomDomain as setCustomDomainApi
} from '../api/satellite.api';
import type {SatelliteParameters} from '../types/actor.types';
import type {CustomDomain} from '../types/customdomain.types';

/**
 * Lists the custom domains for a satellite.
 * @param {Object} params - The parameters for listing the custom domains.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @returns {Promise<CustomDomain[]>} A promise that resolves to an array of custom domains.
 */
export const listCustomDomains = async ({
  satellite
}: {
  satellite: SatelliteParameters;
}): Promise<CustomDomain[]> => {
  const domains = await listCustomDomainsApi({
    satellite
  });

  return domains.map(([domain, details]) => {
    const domainVersion = fromNullable(details.version);

    return {
      domain,
      bn_id: fromNullable(details.bn_id),
      created_at: details.created_at,
      updated_at: details.updated_at,
      ...(nonNullish(domainVersion) && {version: domainVersion})
    };
  });
};

/**
 * Sets the custom domains for a satellite.
 * @param {Object} params - The parameters for setting the custom domains.
 * @param {SatelliteParameters} params.satellite - The satellite parameters.
 * @param {CustomDomain[]} params.domains - The custom domains to set.
 * @returns {Promise<void[]>} A promise that resolves when the custom domains are set.
 */
export const setCustomDomains = ({
  satellite,
  domains
}: {
  satellite: SatelliteParameters;
  domains: CustomDomain[];
}): Promise<void[]> =>
  Promise.all(
    domains.map(({domain: domainName, bn_id: boundaryNodesId}) =>
      setCustomDomainApi({
        satellite,
        domainName,
        boundaryNodesId
      })
    )
  );
