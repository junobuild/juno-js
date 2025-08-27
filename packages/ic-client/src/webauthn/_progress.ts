import type {WebAuthnSignProgress, WebAuthnSignProgressArgs} from './types/progress';

export const execute = async <T>({
  fn,
  step,
  onProgress
}: {
  fn: () => Promise<T>;
} & Pick<WebAuthnSignProgress, 'step'> &
  WebAuthnSignProgressArgs): Promise<T> => {
  onProgress?.({
    step,
    state: 'in_progress'
  });

  try {
    const result = await fn();

    onProgress?.({
      step,
      state: 'success'
    });

    return result;
  } catch (err: unknown) {
    onProgress?.({
      step,
      state: 'error'
    });

    throw err;
  }
};
