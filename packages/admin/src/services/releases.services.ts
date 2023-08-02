import {coerce, compare, eq, gt, lt, major, minor, patch, type SemVer} from 'semver';
import {githubJunoReleases} from '../rest/github.rest';
import type {GitHubAsset, GitHubRelease} from '../types/github.types';

export type NewerReleasesAssetKey = 'satellite' | 'mission_control';

export type NewerReleasesParams = {
  currentVersion: string;
  assetKey: NewerReleasesAssetKey;
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

export interface PromptReleases {
  title: string;
  value: GitHubAsset;
}

export const mapPromptReleases = ({
  githubReleases,
  assetKey
}: {
  githubReleases: GitHubRelease[];
  assetKey: NewerReleasesAssetKey;
}): PromptReleases[] =>
  githubReleases.reduce((acc, {assets}: GitHubRelease) => {
    const asset = assets?.find(({name}) => name.includes(assetKey));

    const version = coerce(asset?.name ?? '');

    const title = `v${version}`; // (published in Juno ${tag_name})

    return [...acc, ...(asset !== undefined ? [{title, value: asset}] : [])];
  }, [] as PromptReleases[]);

export const checkUpgradeVersion = ({
  currentVersion,
  selectedVersion
}: {
  currentVersion: string;
  selectedVersion: string;
}): {canUpgrade: boolean} => {
  const currentMajor = major(currentVersion);
  const selectedMajor = major(selectedVersion);
  const currentMinor = minor(currentVersion);
  const selectedMinor = minor(selectedVersion);
  const currentPath = patch(currentVersion);
  const selectedPath = patch(selectedVersion);

  if (
    currentMajor < selectedMajor - 1 ||
    currentMinor < selectedMinor - 1 ||
    currentPath < selectedPath - 1
  ) {
    return {canUpgrade: false};
  }

  return {canUpgrade: true};
};
