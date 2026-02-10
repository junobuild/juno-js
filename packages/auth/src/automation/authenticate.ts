import {initContext} from './_context';
import {authenticateAutomation as authenticate} from './_session';
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
      credentials: {jwt},
      automation
    }
  } = params;

  return await authenticate<T>({
    jwt,
    context,
    automation
  });
};
