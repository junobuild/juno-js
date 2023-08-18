export interface AnalyticEvent {
  sessionId: string;
  collectedAt: number;
}

// TODO: remove and replace with type from declarations
export interface TrackEvent<T> extends AnalyticEvent {
  name: string;
  data: T;
}
