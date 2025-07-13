import {IdbStorage, KEY_STORAGE_DELEGATION} from '@dfinity/auth-client';
import {DelegationChain, isDelegationValid} from '@dfinity/identity';

/**
 * If there is no delegation or if not valid, then delegation is not valid.
 *
 * @returns Object true if delegation is valid and delegation
 */
export const checkDelegationChain = async (): Promise<{
  valid: boolean;
  delegation: DelegationChain | null;
}> => {
  const idbStorage: IdbStorage = new IdbStorage();
  const delegationChain: string | null = await idbStorage.get(KEY_STORAGE_DELEGATION);

  const delegation = delegationChain !== null ? DelegationChain.fromJSON(delegationChain) : null;

  return {
    valid: delegation !== null && isDelegationValid(delegation),
    delegation
  };
};
