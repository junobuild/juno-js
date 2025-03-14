import {jsonReplacer} from '@dfinity/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const __juno_satellite_console_log = (v: any[]) => {
  const msg = v
    .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, jsonReplacer) : arg))
    .join(' ');

  globalThis.__ic_cdk_print(msg);
};

// @ts-expect-error We want to override the console
globalThis.console = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...v: any[]) {
    __juno_satellite_console_log(v);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(...v: any[]) {
    __juno_satellite_console_log(v);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...v: any[]) {
    __juno_satellite_console_log(v);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...v: any[]) {
    __juno_satellite_console_log(v);
  }
};
