import type {AuthParameters} from '../delegation/types/authenticate';
import {authenticateAutomation as authenticateAutomationApi} from './api/automation.api';
import {AutomationError, GenerateJwtError} from './errors';
import type {
  AuthenticatedAutomation,
  AutomationCredentials,
  AutomationParameters
} from './types/authenticate';
import type {OpenIdAutomationContext} from './types/context';

interface AutomationArgs {
  jwt: string;
  context: Omit<OpenIdAutomationContext, 'nonce'>;
  automation: AutomationParameters;
}

type AuthenticationAutomationArgs = AutomationCredentials & {
  context: OpenIdAutomationContext;
  automation: AutomationParameters;
};

export const authenticateAutomation = async <T extends AuthParameters>({
  generateJwt,
  context: {nonce, ...context},
  automation
}: AuthenticationAutomationArgs): Promise<AuthenticatedAutomation> => {
  const generate = async (): Promise<{jwt: string}> => {
    try {
      return await generateJwt({nonce});
    } catch (err: unknown) {
      throw new GenerateJwtError({cause: err});
    }
  };

  return await authenticate<T>({
    ...(await generate()),
    context,
    automation
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const authenticate = async <T extends AuthParameters>({
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

  const {Ok: data} = result;

  return {
    identity: caller,
    data
  };
};
