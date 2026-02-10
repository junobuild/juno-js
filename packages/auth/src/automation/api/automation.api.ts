import type {ActorParameters, AutomationArgs, AutomationResult} from '../types/actor';
import {getAutomationActor} from './_actor.api';

export const authenticateAutomation = async ({
  actorParams,
  args
}: {
  args: AutomationArgs;
  actorParams: ActorParameters;
}): Promise<AutomationResult> => {
  const {authenticate_automation} = await getAutomationActor(actorParams);
  return await authenticate_automation(args);
};
