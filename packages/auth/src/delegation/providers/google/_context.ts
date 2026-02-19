import type {Nonce} from '../../../types/nonce';
import {generateRandomState} from '../../utils/state.utils';

// eslint-disable-next-line require-await
export const generateGoogleState = async (_params: {nonce: Nonce}): Promise<string> =>
  generateRandomState();
