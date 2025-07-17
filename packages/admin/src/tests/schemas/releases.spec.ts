import {ReleasesMetadataSchema} from '../../schemas/releases';

describe('releases', () => {
  it('validates correct metadata structure', () => {
    const validData = {
      mission_controls: ['1.0.0'],
      satellites: ['1.0.0'],
      orbiters: ['1.0.0'],
      releases: [
        {
          tag: '1.0.0',
          console: '1.0.0',
          observatory: '1.0.0',
          mission_control: '1.0.0',
          satellite: '1.0.0',
          orbiter: '1.0.0'
        }
      ]
    };

    expect(() => ReleasesMetadataSchema.parse(validData)).not.toThrow();
  });

  it('fails with invalid version format', () => {
    const invalidData = {
      mission_controls: ['1.0.0'],
      satellites: ['1.0.0'],
      orbiters: ['invalid-version'],
      releases: [
        {
          tag: '1.0.0',
          console: '1.0.0',
          observatory: '1.0.0',
          mission_control: '1.0.0',
          satellite: '1.0.0',
          orbiter: '1.0.0'
        }
      ]
    };

    expect(() => ReleasesMetadataSchema.parse(invalidData)).toThrowError(
      /Version does not match x\.y\.z format/
    );
  });

  it('fails if release tags are not unique', () => {
    const duplicateTags = {
      mission_controls: ['1.0.0'],
      satellites: ['1.0.0'],
      orbiters: ['1.0.0'],
      releases: [
        {
          tag: '1.0.0',
          console: '1.0.0',
          observatory: '1.0.0',
          mission_control: '1.0.0',
          satellite: '1.0.0',
          orbiter: '1.0.0'
        },
        {
          tag: '1.0.0',
          console: '1.0.1',
          observatory: '1.0.1',
          mission_control: '1.0.1',
          satellite: '1.0.1',
          orbiter: '1.0.1'
        }
      ]
    };

    expect(() => ReleasesMetadataSchema.parse(duplicateTags)).toThrowError(
      /A release tag appears multiple times but must be unique/
    );
  });
});
