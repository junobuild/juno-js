export interface PageView {
  title: typeof document.title;
  href: typeof document.location.href;
  referrer: typeof document.referrer | undefined;
  device: {
    innerWidth: typeof window.innerWidth;
    innerHeight: typeof window.innerHeight;
  };
  userAgent: typeof navigator.userAgent;
  timeZone: string;
  collectedAt: bigint;
}
