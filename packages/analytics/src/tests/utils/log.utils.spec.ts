import {warningOrbiterServicesNotInitialized} from '../../utils/log.utils';

describe('log.utils', () => {
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should warn if value is null', () => {
    warningOrbiterServicesNotInitialized(null);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unable to connect to the analytics services. Did you call `initOrbiter`?'
    );
  });

  it('should warn if value is undefined', () => {
    warningOrbiterServicesNotInitialized(undefined);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Unable to connect to the analytics services. Did you call `initOrbiter`?'
    );
  });

  it('should not warn if value is defined', () => {
    warningOrbiterServicesNotInitialized({});
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
