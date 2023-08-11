export interface AnalyticEvent {
  sessionId: string;
  collectedAt: number;
}

export interface PageView extends AnalyticEvent {
  title: typeof document.title;
  href: typeof document.location.href;
  referrer: typeof document.referrer | undefined;
  device: {
    innerWidth: typeof window.innerWidth;
    innerHeight: typeof window.innerHeight;
  };
  userAgent: typeof navigator.userAgent;
  timeZone: string;
}

export interface TrackEvent<T> extends AnalyticEvent {
  name: string;
  data: T;
}
