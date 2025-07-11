import type {HttpAgent} from '@dfinity/agent';
import {vi} from 'vitest';
import {mock} from 'vitest-mock-extended';

vi.mock(import('./packages/core/src/stores/_agent.factory'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // eslint-disable-next-line require-await
    createAgent: async () => mock<HttpAgent>()
  };
});
