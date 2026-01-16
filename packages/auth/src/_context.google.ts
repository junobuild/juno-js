import type {Nonce} from './types/nonce';
import {generateRandomState} from './utils/state.utils';

export const generateState = async (_params: {nonce: Nonce}): Promise<string> =>
  generateRandomState();
