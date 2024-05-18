/**
 * Creates a debounced function that delays invoking the provided function until after the specified timeout.
 * @param {Function} func - The function to debounce.
 * @param {number} [timeout=300] - The number of milliseconds to delay. Defaults to 300ms if not specified or invalid.
 * @returns {Function} A debounced function.
 */
/* eslint-disable-next-line @typescript-eslint/ban-types */
export const debounce = (func: Function, timeout?: number): Function => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args: unknown[]) => {
    const next = () => func(...args);

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(next, timeout !== undefined && timeout > 0 ? timeout : 300);
  };
};
