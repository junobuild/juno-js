import type {OrbiterDid} from '@junobuild/ic-client/actor';
import * as actor from '@junobuild/ic-client/actor';
import {listControllers, memorySize, setControllers, version} from '../../api/orbiter.api';
import {mockIdentity, mockUserIdPrincipal} from '../mocks/admin.mock';
import {mockController, mockControllers} from '../mocks/modules.mock';

vi.mock(import('@junobuild/ic-client/actor'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOrbiterActor: vi.fn(),
    getDeprecatedOrbiterVersionActor: vi.fn()
  };
});

const mockActor = {
  version: vi.fn(),
  list_controllers: vi.fn(),
  memory_size: vi.fn(),
  set_controllers: vi.fn()
};

describe('orbiter.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    vi.mocked(actor.getOrbiterActor).mockResolvedValue(mockActor);
    // @ts-ignore
    vi.mocked(actor.getDeprecatedOrbiterVersionActor).mockResolvedValue(mockActor);
  });

  describe('version', () => {
    it('returns the version string', async () => {
      mockActor.version.mockResolvedValue('0.0.8');
      const result = await version({orbiter: {identity: mockIdentity}});
      expect(result).toBe('0.0.8');
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.version.mockRejectedValueOnce(err);
      await expect(version({orbiter: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('listControllers', () => {
    it('returns controller list', async () => {
      mockActor.list_controllers.mockResolvedValue(mockControllers);
      const result = await listControllers({
        orbiter: {identity: mockIdentity},
        certified: true
      });
      expect(result).toEqual(mockControllers);
      expect(actor.getOrbiterActor).toHaveBeenCalledWith({identity: mockIdentity, certified: true});
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.list_controllers.mockRejectedValueOnce(err);
      await expect(listControllers({orbiter: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });

  describe('setControllers', () => {
    const args: OrbiterDid.SetControllersArgs = {
      controller: mockController,
      controllers: [mockUserIdPrincipal]
    };

    it('sets controllers', async () => {
      const expectedResponse = [
        [
          mockUserIdPrincipal,
          {
            updated_at: 1624532800000n,
            metadata: [['key', 'value']],
            created_at: 1624532700000n,
            scope: {Admin: null},
            expires_at: [1624532900000n]
          }
        ]
      ];

      mockActor.set_controllers.mockResolvedValue(expectedResponse);

      const result = await setControllers({orbiter: {identity: mockIdentity}, args});
      expect(result).toEqual(expectedResponse);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.set_controllers.mockRejectedValueOnce(err);
      await expect(setControllers({orbiter: {identity: mockIdentity}, args})).rejects.toThrow(err);
    });
  });

  describe('memorySize', () => {
    it('returns memory size', async () => {
      const data = {heap: BigInt(123), stable: BigInt(456)};
      mockActor.memory_size.mockResolvedValue(data);
      const result = await memorySize({orbiter: {identity: mockIdentity}});
      expect(result).toEqual(data);
    });

    it('bubbles errors', async () => {
      const err = new Error('fail');
      mockActor.memory_size.mockRejectedValueOnce(err);
      await expect(memorySize({orbiter: {identity: mockIdentity}})).rejects.toThrow(err);
    });
  });
});
