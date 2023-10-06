export interface ReleaseMetadata {
  tag: string;
  console: string;
  observatory: string;
  mission_control: string;
  satellite: string;
  orbiter: string;
}

export interface ReleasesMetadata {
  mission_controls: string[];
  satellites: string[];
  orbiters: string[];
  releases: ReleaseMetadata[];
}
