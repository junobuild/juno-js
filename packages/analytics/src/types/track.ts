import type {SetTrackEventPayload} from './orbiter';

export type TrackEvent = Pick<SetTrackEventPayload, 'name' | 'metadata'>;
