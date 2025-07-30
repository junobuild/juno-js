import {Controller} from '../../../declarations/orbiter/orbiter.did';
import * as actor from '../../api/_actor.api';
import {listControllers, memorySize, version} from '../../api/orbiter.api';
import {mockIdentity, mockSatelliteIdPrincipal} from '../mocks/mocks';
import {mockControllers} from '../mocks/modules.mocks';

vi.mock('../../api/_actor.api', () => ({
  getOrbiterActor: vi.fn(),
  getDeprecatedOrbiterVersionActor: vi.fn()
}));

const mockActor = {
  version: vi.fn(),
  list_controllers: vi.fn(),
  memory_size: vi.fn()
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
