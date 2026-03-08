// Source: https://stackoverflow.com/a/77489094/5404186
export const convertCamelToSnake = (str: string): string =>
  str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase();

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);
