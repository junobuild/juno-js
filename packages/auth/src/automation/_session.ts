import type {AuthParameters} from '../delegation/types/authenticate';
import {authenticateAutomation as authenticateAutomationApi} from './api/automation.api';
import {AutomationError} from './errors';
import type {AuthenticatedAutomation, AutomationParameters} from './types/authenticate';
import type {OpenIdAutomationContext} from './types/context';

interface AutomationArgs {
  jwt: string;
  context: OpenIdAutomationContext;
  automation: AutomationParameters;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authenticateAutomation = async <T extends AuthParameters>({
  jwt,
  context: {caller, salt},
  automation
}: AutomationArgs): Promise<AuthenticatedAutomation> => {
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

  return result.Ok;
};
