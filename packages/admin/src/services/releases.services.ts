import {coerce, compare, eq, gt, lt, type SemVer} from 'semver';
import {githubJunoReleases} from '../rest/github.rest';
import {GitHubRelease} from '../types/github.types';

export type NewerReleasesParams = {
  currentVersion: string;
  assetKey: 'satellite' | 'mission_control';
};

export const newerReleases = async ({
  currentVersion,
  assetKey
}: NewerReleasesParams): Promise<{result: GitHubRelease[] | undefined; error?: string}> => {
  const releases = await githubJunoReleases();

  if (releases === undefined) {
    return {result: undefined, error: 'Cannot fetch GitHub repo releases 😢.'};
  }

  const releasesWithAssets = releases.filter(
    ({assets}) => assets?.find(({name}) => name.includes(assetKey)) !== undefined
  );

  if (releasesWithAssets.length === 0) {
    return {result: undefined, error: 'No assets has been released. Reach out Juno❗'};
  }

  const newReleases = releasesWithAssets
    .filter(({assets}) => {
      const asset = assets?.find(({name}) => name.includes(assetKey));

      if (asset === undefined) {
        return false;
      }

      const version = coerce(asset.name)?.format();

      if (version === undefined) {
        return false;
      }

      return compare(currentVersion, version) === -1;
    })
    .reduce((acc, release) => {
      const findAssetVersion = ({assets}: GitHubRelease): SemVer | null => {
        const asset = assets?.find(({name}) => name.includes(assetKey));
        return coerce(asset?.name ?? '');
      };

      // We want to display the asset release with the lowest global release!
      // e.g. if satellite v0.0.2 is present in Juno v0.0.4 and v0.0.5, we want to present "Satellite v0.0.2 (Juno v0.0.4)"

      // There is a release in the accumulator with a same asset version but a global version lower
      // e.g. accumulator has satellite v0.0.2 in Juno v0.0.10 but release is Juno v0.0.11 with same satellite v0.0.2
      if (
        acc.find((existing) => {
          const version = findAssetVersion(release);
          const existingVersion = findAssetVersion(existing);

          return (
            eq(version?.raw ?? '', existingVersion?.raw ?? '') &&
            lt(existing.tag_name, release.tag_name)
          );
        }) !== undefined
      ) {
        return acc;
      }

      // There is a release in the accumulator with a same asset version but a global version newer
      // e.g. accumulator has satellite v0.0.2 in Juno v0.0.12 but release is Juno v0.0.11 with same satellite v0.0.2
      const existingIndex = acc.findIndex((existing) => {
        const version = findAssetVersion(release);
        const existingVersion = findAssetVersion(existing);

        return (
          eq(version?.raw ?? '', existingVersion?.raw ?? '') &&
          gt(existing.tag_name, release.tag_name)
        );
      });

      if (existingIndex !== undefined) {
        return [...acc.filter((_, index) => index !== existingIndex), release];
      }

      return [...acc, release];
    }, [] as GitHubRelease[]);

  return {result: newReleases};
};
