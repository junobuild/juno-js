import {nonNullish} from '@dfinity/utils';
import {
  spawn as spawnCommand,
  type ChildProcess,
  type ChildProcessWithoutNullStreams
} from 'child_process';
import {applyForceShell} from './cmd.windows.utils';

export const spawn = async ({
  command,
  cwd,
  args,
  env,
  stdout,
  silentOut = false,
  silentErrors = false
}: {
  command: string;
  cwd?: string;
  args?: readonly string[];
  env?: NodeJS.ProcessEnv;
  stdout?: (output: string) => void;
  silentOut?: boolean;
  silentErrors?: boolean;
}): Promise<number | null> =>
  // eslint-disable-next-line no-async-promise-executor
  await new Promise<number | null>(async (resolve, reject) => {
    const [escapedCommand, escapedArgs, options] = await applyForceShell(command, args ?? [], {
      ...(nonNullish(cwd) && {cwd}),
      ...(nonNullish(env) && {env})
    });

    const process: ChildProcessWithoutNullStreams = spawnCommand(
      escapedCommand,
      escapedArgs,
      options
    );

    process.stdout.on('data', (data) => {
      if (nonNullish(stdout)) {
        stdout(`${data}`);
        return;
      }

      if (silentOut) {
        return;
      }

      console.log(`${data}`);
    });
    process.stderr.on('data', (data) => {
      if (silentErrors) {
        return;
      }

      reject(new Error(`${data}`));
    });

    process.on('close', (code) => {
      resolve(code);
    });
    process.on('error', (err) => {
      reject(err);
    });
  });

export const execute = async ({
  command,
  args,
  env
}: {
  command: string;
  args?: readonly string[];
  env?: NodeJS.ProcessEnv;
}): Promise<number | null> =>
  // eslint-disable-next-line no-async-promise-executor
  await new Promise<number | null>(async (resolve) => {
    const [escapedCommand, escapedArgs, options] = await applyForceShell(command, args ?? [], {
      stdio: 'inherit',
      ...(nonNullish(env) && {env})
    });

    const childProcess: ChildProcess = spawnCommand(escapedCommand, escapedArgs ?? [], options);

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);
        return;
      }

      // The child process encountered an error and exited abnormally. Since the child-process passes the error output to the terminal, we also close the CLI process without bubbling up and displaying any specific error.
      process.exit(1);
    });
  });
