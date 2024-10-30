import {execute} from '../utils/cmd.utils';

export const executeHooks = async (hooks?: string[]) => {
  for (const hook of hooks ?? []) {
    const [cmd, ...args] = hook.split(' ');
    await execute({command: cmd, args});
  }
};
