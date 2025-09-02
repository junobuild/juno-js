import {execute} from '../../../auth/helpers/progress.helpers';
import {SignProgressFn} from '../../../auth/types/progress';
import {WebAuthnSignInProgressStep} from '../../../auth/types/webauthn';

describe('progress.helpers', () => {
  describe('execute', () => {
    it('emits in_progress then success and returns the result', async () => {
      const onProgress = vi.fn();
      const fn = vi.fn(async () => 'ok');

      await expect(
        execute({fn, step: WebAuthnSignInProgressStep.RequestingUserCredential, onProgress})
      ).resolves.toBe('ok');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress.mock.calls[0][0]).toEqual({
        step: WebAuthnSignInProgressStep.RequestingUserCredential,
        state: 'in_progress'
      });
      expect(onProgress.mock.calls[1][0]).toEqual({
        step: WebAuthnSignInProgressStep.RequestingUserCredential,
        state: 'success'
      });
    });

    it('emits in_progress then error and rethrows (async rejection)', async () => {
      const onProgress = vi.fn();
      const boom = new Error('boom');
      const fn = vi.fn(async () => {
        throw boom; // async path
      });

      await expect(
        execute({fn, step: WebAuthnSignInProgressStep.FinalizingCredential, onProgress})
      ).rejects.toThrow(boom);

      expect(fn).toHaveBeenCalledTimes(1);
      expect(onProgress).toHaveBeenCalledTimes(2);
      expect(onProgress.mock.calls[0][0]).toEqual({
        step: WebAuthnSignInProgressStep.FinalizingCredential,
        state: 'in_progress'
      });
      expect(onProgress.mock.calls[1][0]).toEqual({
        step: WebAuthnSignInProgressStep.FinalizingCredential,
        state: 'error'
      });
    });

    it('does nothing if onProgress is not provided', async () => {
      const fn = vi.fn(async () => 42);

      await expect(execute({fn, step: WebAuthnSignInProgressStep.FinalizingSession})).resolves.toBe(
        42
      );

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('fires in_progress before awaiting fn (ordering check)', async () => {
      let started = false;
      const onProgress: SignProgressFn<WebAuthnSignInProgressStep> = (p) => {
        if (p.state === 'in_progress') started = true;
      };

      const fn = vi.fn(async () => {
        // when fn begins, in_progress should already have been emitted
        expect(started).toBe(true);
        return 'ok';
      });

      await expect(
        execute({fn, step: WebAuthnSignInProgressStep.RetrievingUser, onProgress})
      ).resolves.toBe('ok');

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
