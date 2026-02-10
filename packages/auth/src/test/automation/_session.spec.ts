import {authenticateAutomation} from '../../automation/_session';
import * as automationApi from '../../automation/api/automation.api';
import {AutomationError, GenerateJwtError} from '../../automation/errors';
import type {AutomationResult} from '../../automation/types/actor';
import type {AutomationParameters} from '../../automation/types/authenticate';
import {OpenIdAutomationContext} from '../../automation/types/context';
import {mockIdentity} from '../mocks/identity.mock';
import {mockSatelliteIdText, mockUserIdPrincipal} from '../mocks/principal.mock';

vi.mock('../../automation/api/automation.api', () => ({
  authenticateAutomation: vi.fn()
}));

describe('_session', () => {
  const jwt = '123456778';
  const caller = mockIdentity;
  const salt = new Uint8Array([1, 2, 3, 4]);
  const nonce = 'mock-nonce-123';

  const context: OpenIdAutomationContext = {caller, salt, nonce};

  const automation: AutomationParameters = {
    satellite: {satelliteId: mockSatelliteIdText}
  };

  const mockGenerateJwt = vi.fn();

  const automationArgs = {generateJwt: mockGenerateJwt, context, automation};

  const mockController = {
    scope: {Write: null},
    expires_at: 123456789n
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    mockGenerateJwt.mockResolvedValue({jwt});
  });

  it('should generateJwt with nonce and call authenticateAutomationApi', async () => {
    vi.mocked(automationApi.authenticateAutomation).mockResolvedValue({
      Ok: [mockUserIdPrincipal, mockController]
    } as AutomationResult);

    const result = await authenticateAutomation(automationArgs);

    expect(result).toStrictEqual([mockUserIdPrincipal, mockController]);

    expect(mockGenerateJwt).toHaveBeenCalledTimes(1);
    expect(mockGenerateJwt).toHaveBeenCalledWith({nonce});

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

  it('should throw GenerateJwtError when generateJwt fails', async () => {
    const error = new Error('JWT generation failed');
    mockGenerateJwt.mockRejectedValue(error);

    await expect(authenticateAutomation(automationArgs)).rejects.toBeInstanceOf(GenerateJwtError);
    expect(automationApi.authenticateAutomation).not.toHaveBeenCalled();
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
