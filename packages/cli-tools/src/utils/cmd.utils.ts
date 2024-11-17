import {nonNullish} from '@junobuild/utils';
import {
  spawn as spawnCommand,
  type ChildProcess,
  type ChildProcessWithoutNullStreams
} from 'child_process';

export const spawn = async ({
  command,
  cwd,
  args,
  stdout,
  silentOut = false,
  silentErrors = false
}: {
  command: string;
  cwd?: string;
  args?: readonly string[];
  stdout?: (output: string) => void;
  silentOut?: boolean;
  silentErrors?: boolean;
}): Promise<number | null> => await new Promise<number | null>((resolve, reject) => {
    const process: ChildProcessWithoutNullStreams = spawnCommand(command, args, {
      shell: true,
      ...(nonNullish(cwd) && {cwd})
    });

    process.stdout.on('data', (data) => {
      if (nonNullish(stdout)) {
        stdout(`${data}`);
        return;
      }

      if (silentOut) {
        return;
      }

      // eslint-disable-next-line no-console
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
  args
}: {
  command: string;
  args?: readonly string[];
}): Promise<number | null> => await new Promise<number | null>((resolve) => {
    const childProcess: ChildProcess = spawnCommand(command, args ?? [], {
      stdio: 'inherit'
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(code);
        return;
      }

      // The child process encountered an error and exited abnormally. Since the child-process passes the error output to the terminal, we also close the CLI process without bubbling up and displaying any specific error.
      process.exit(1);
    });
  });
