export const isSatelliteError = ({error, type}: {error: unknown; type: string}): boolean => {
  if (typeof error === 'string') {
    return error.includes(type);
  }

  if (error instanceof Error) {
    return error.message.includes(type);
  }

  return false;
};
