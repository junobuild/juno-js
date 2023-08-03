import {major, minor, patch} from 'semver';

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
