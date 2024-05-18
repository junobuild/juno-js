/**
 * Checks if the current environment is a browser.
 * @returns {boolean} True if the current environment is a browser, false otherwise.
 */
export const isBrowser = (): boolean => typeof window !== `undefined`;
