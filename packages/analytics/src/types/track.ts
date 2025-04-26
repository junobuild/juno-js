import type {SetTrackEventPayload} from './api.payload';

export type TrackEvent = Pick<SetTrackEventPayload, 'name' | 'metadata'>;
