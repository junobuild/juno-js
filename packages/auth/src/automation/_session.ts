import type {AuthParameters} from '../delegation/types/authenticate';
import {authenticateAutomation as authenticateAutomationApi} from './api/automation.api';
import {AutomationError} from './errors';
import type {AutomationParameters} from './types/auhtenticate';
import type {OpenIdAutomationContext} from './types/context';

interface AutomationArgs {
  jwt: string;
  context: OpenIdAutomationContext;
  automation: AutomationParameters;
}

export const authenticateAutomation = async <T extends AuthParameters>({
  jwt,
  context: {caller, salt},
  automation
}: AutomationArgs): Promise<void> => {
  const result = await authenticateAutomationApi({
    args: {
      OpenId: {
        jwt,
        salt
      }
    },
    actorParams: {
      automation,
      identity: caller
    }
  });

  if ('Err' in result) {
    throw new AutomationError('Automation authentication failed', {cause: result});
  }
};
