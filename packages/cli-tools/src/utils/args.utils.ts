export const hasArgs = ({args, options}: {args?: string[]; options: string[]}): boolean =>
  args?.find((arg) => options.includes(arg)) !== undefined;

export const nextArg = ({args, option}: {args?: string[]; option: string}): string | undefined => {
  const index = (args ?? []).findIndex((arg) => arg === option);

  if (index === -1) {
    return undefined;
  }

  return args?.[index + 1];
};
