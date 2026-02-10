import {initContext} from './_context';
import {authenticateAutomation as authenticate} from './_session';
import type {AutomationParameters, AutomationParams} from './types/auhtenticate';

export const authenticateAutomation = async <T extends AutomationParameters>(
  params: AutomationParams<T>
): Promise<void> => {
  const context = await initContext();

  const {
    github: {
      credentials: {jwt},
      automation
    }
  } = params;

  await authenticate({
    jwt,
    context,
    automation
  });
};
