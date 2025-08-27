import {execute} from '../../webauthn/_progress';
import {WebAuthnSignProgressStep} from '../../webauthn/types/progress';

describe('_progress', () => {
  it('should emit in_progress then success and returns the value', async () => {
    const onProgress = vi.fn();

    const res = await execute({
      fn: async () => 'ok',
      step: WebAuthnSignProgressStep.RequestingUserCredential,
      onProgress
    });

    expect(res).toBe('ok');

    expect(onProgress.mock.calls).toEqual([
      [{step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'in_progress'}],
      [{step: WebAuthnSignProgressStep.RequestingUserCredential, state: 'success'}]
    ]);

    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it('should emit in_progress then error and propagates the error', async () => {
    const onProgress = vi.fn();

    const error = new Error('my error');

    await expect(
      execute({
        fn: async () => {
          throw error;
        },
        step: WebAuthnSignProgressStep.Signing,
        onProgress
      })
    ).rejects.toBe(error);

    expect(onProgress.mock.calls).toEqual([
      [{step: WebAuthnSignProgressStep.Signing, state: 'in_progress'}],
      [{step: WebAuthnSignProgressStep.Signing, state: 'error'}]
    ]);

    expect(onProgress).toHaveBeenCalledTimes(2);
  });

  it('should work without onProgress', async () => {
    const res = await execute({
      fn: async () => 42,
      step: WebAuthnSignProgressStep.FinalizingCredential
    });

    expect(res).toBe(42);
  });
});
