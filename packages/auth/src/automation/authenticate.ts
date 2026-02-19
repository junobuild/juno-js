import {authenticateAutomation as authenticate} from './_automation';
import {initContext} from './_context';
import type {
  AuthenticatedAutomation,
  AutomationParameters,
  AutomationParams
} from './types/authenticate';

export const authenticateAutomation = async <T extends AutomationParameters>(
  params: AutomationParams<T>
): Promise<AuthenticatedAutomation> => {
  const context = await initContext();

  const {
    github: {
      credentials: {generateJwt},
      automation
    }
  } = params;

  return await authenticate<T>({
    generateJwt,
    context,
    automation
  });
};
