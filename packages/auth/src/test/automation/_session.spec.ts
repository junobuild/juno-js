import {authenticateAutomation} from '../../automation/_session';
import * as automationApi from '../../automation/api/automation.api';
import {AutomationError} from '../../automation/errors';
import type {AutomationResult} from '../../automation/types/actor';
import type {AutomationParameters} from '../../automation/types/authenticate';
import {OpenIdAutomationContext} from '../../automation/types/context';
import {mockIdentity} from '../mocks/identity.mock';
import {mockSatelliteIdText, mockUserIdPrincipal} from '../mocks/principal.mock';

vi.mock('../../automation/api/automation.api', () => ({
  authenticateAutomation: vi.fn()
}));

describe('_automation', () => {
  const jwt = '123456778';
  const caller = mockIdentity;
  const salt = new Uint8Array([1, 2, 3, 4]);

  const context: OpenIdAutomationContext = {caller, salt};

  const automation: AutomationParameters = {
    satellite: {satelliteId: mockSatelliteIdText}
  };

  const automationArgs = {jwt, context, automation};

  const mockController = {
    scope: {Write: null},
    expires_at: 123456789n
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should call authenticateAutomationApi and return result', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Ok: [mockUserIdPrincipal, mockController]
    } as AutomationResult);

    const result = await authenticateAutomation(automationArgs);

    expect(result).toStrictEqual([mockUserIdPrincipal, mockController]);

    expect(automationApi.authenticateAutomation).toHaveBeenCalledTimes(1);
    expect(automationApi.authenticateAutomation).toHaveBeenCalledWith({
      args: {
        OpenId: {
          jwt,
          salt
        }
      },
      actorParams: {automation, identity: caller}
    });
  });

  it('should throw AutomationError when authenticateAutomationApi returns Err', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Err: {RegisterController: 'Error'}
    });

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(AutomationError);
  });

  it('should throw AutomationError for PrepareAutomation error', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Err: {
        PrepareAutomation: {GetCachedJwks: null}
      }
    });

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(AutomationError);
  });

  it('should throw AutomationError for RegisterController error', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Err: {RegisterController: 'Failed to register controller'}
    });

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(AutomationError);
  });

  it('should throw AutomationError for SaveWorkflowMetadata error', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Err: {SaveWorkflowMetadata: 'Failed to save metadata'}
    });

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(AutomationError);
  });

  it('should throw AutomationError for SaveUniqueJtiToken error', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Err: {SaveUniqueJtiToken: 'Failed to save token'}
    });

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(AutomationError);
  });
});
