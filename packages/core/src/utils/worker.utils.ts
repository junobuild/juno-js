// Source: https://stackoverflow.com/a/62963963/5404186
export const supportsWorker = (): boolean => {
  let supports = false;
  const tester: WorkerOptions = {
    get type() {
      // it's been called, it's supported
      supports = true;
      return undefined;
    }
  };
  try {
    // We use "blob://" as url to avoid an useless network request.
    // This will either throw in Chrome
    // either fire an error event in Firefox
    // which is perfect since
    // we don't need the worker to actually start,
    // checking for the type of the script is done before trying to load it.
    const worker = new Worker('blob://', tester);
  } finally {
    return supports;
  }
};
