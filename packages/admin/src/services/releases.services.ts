import {major, minor, patch} from 'semver';

/**
 * Checks if the selected version can be upgraded from the current version.
 * @param {Object} params - The parameters for the version check.
 * @param {string} params.currentVersion - The current version.
 * @param {string} params.selectedVersion - The selected version.
 * @returns {Object} An object indicating whether the upgrade can proceed.
 * @returns {boolean} returns.canUpgrade - Whether the selected version can be upgraded from the current version.
 */
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
