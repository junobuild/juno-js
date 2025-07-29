import {checkUpgradeVersion} from '../../helpers/version.helpers';

describe('checkUpgradeVersion', () => {
  it('should allow upgrade when selected version is the same as current version', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '1.0.0'
    });
    expect(result).toEqual({canUpgrade: true});
  });

  it('should allow upgrade when selected version is a patch upgrade', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '1.0.1'
    });
    expect(result).toEqual({canUpgrade: true});
  });

  it('should allow upgrade when selected version is a minor upgrade', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '1.1.0'
    });
    expect(result).toEqual({canUpgrade: true});
  });

  it('should allow upgrade when selected version is a major upgrade', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '2.0.0'
    });
    expect(result).toEqual({canUpgrade: true});
  });

  it('should not allow upgrade when selected version skips a major version', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '3.0.0'
    });
    expect(result).toEqual({canUpgrade: false});
  });

  it('should not allow upgrade when selected version skips a minor version', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '1.2.0'
    });
    expect(result).toEqual({canUpgrade: false});
  });

  it('should not allow upgrade when selected version skips a patch version', () => {
    const result = checkUpgradeVersion({
      currentVersion: '1.0.0',
      selectedVersion: '1.0.2'
    });
    expect(result).toEqual({canUpgrade: false});
  });
});
