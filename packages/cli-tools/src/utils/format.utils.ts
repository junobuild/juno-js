export const formatBytes = (bytes: number): string => {
  const unit = bytes >= 1000 ? 'megabyte' : 'kilobyte';

  const formatter = new Intl.NumberFormat('en', {
    style: 'unit',
    unit
  });

  return formatter.format(bytes / (unit === 'megabyte' ? 1_000_000 : 1_000));
};