export interface ReleaseMetadata {
  tag: string;
  console: string;
  observatory: string;
  mission_control: string;
  satellite: string;
}

export interface ReleasesMetadata {
  mission_controls: string[];
  satellites: string[];
  releases: ReleaseMetadata[];
}
