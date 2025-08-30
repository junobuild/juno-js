import type {HttpAgent} from '@dfinity/agent';
import 'fake-indexeddb/auto';
import {Blob as BlobPolyfill} from 'node:buffer';
import {vi} from 'vitest';
import {mock} from 'vitest-mock-extended';

// JSDOM limitation
// https://github.com/jsdom/jsdom/issues/2555
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.Blob = BlobPolyfill as any;

vi.mock(import('./packages/core/src/core/stores/_agent.factory'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // eslint-disable-next-line require-await
    createAgent: async () => mock<HttpAgent>()
  };
});
