export const fullPath = ({
  file,
  sourceAbsolutePath
}: {
  file: string;
  sourceAbsolutePath: string;
}): string => file.replace(sourceAbsolutePath, '').replace(/\\/g, '/');
