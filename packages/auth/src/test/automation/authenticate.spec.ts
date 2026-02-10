import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import * as sessionModule from '../../automation/_automation';
import * as contextModule from '../../automation/_context';
import {authenticateAutomation} from '../../automation/authenticate';
import type {
  AuthenticatedAutomation,
  AutomationParameters
} from '../../automation/types/authenticate';
import {mockSatelliteIdText, mockUserIdPrincipal} from '../mocks/principal.mock';

vi.mock('../../automation/_context', () => ({
  initContext: vi.fn()
}));

vi.mock('../../automation/_session', () => ({
  authenticateAutomation: vi.fn()
}));

describe('authenticate', () => {
  const automation: AutomationParameters = {
    satellite: {satelliteId: mockSatelliteIdText}
  };

  const mockController = {
    scope: {Write: null},
    expires_at: 123456789n
  };

  const mockAuthenticatedAutomation: AuthenticatedAutomation = [
    mockUserIdPrincipal,
    mockController
  ];

  const mockCaller = Ed25519KeyIdentity.generate();
  const mockSalt = new Uint8Array([1, 2, 3, 4]);
  const mockNonce = 'mock-nonce-123';

  const mockGenerateJwt = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();

    vi.mocked(contextModule.initContext).mockResolvedValue({
      nonce: mockNonce,
      salt: mockSalt,
      caller: mockCaller
    });
  });

  describe('GitHub', () => {
    describe('With credentials', () => {
      it('should initialize context and authenticate', async () => {
        vi.mocked(sessionModule.authenticateAutomation).mockResolvedValue(
          mockAuthenticatedAutomation
        );

        const result = await authenticateAutomation({
          github: {
            credentials: {generateJwt: mockGenerateJwt},
            automation
          }
        });

        expect(result).toStrictEqual(mockAuthenticatedAutomation);

        expect(contextModule.initContext).toHaveBeenCalledTimes(1);

        expect(sessionModule.authenticateAutomation).toHaveBeenCalledTimes(1);
        expect(sessionModule.authenticateAutomation).toHaveBeenCalledWith({
          generateJwt: mockGenerateJwt,
          context: {
            caller: mockCaller,
            salt: mockSalt,
            nonce: mockNonce
          },
          automation
        });
      });
    });
  });
});
