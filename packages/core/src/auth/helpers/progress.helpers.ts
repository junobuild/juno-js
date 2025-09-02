import type {SignProgressFn} from '../types/progress';

export const execute = async <T, Step>({
  fn,
  step,
  onProgress
}: {
  fn: () => Promise<T>;
  step: Step;
  onProgress?: SignProgressFn<Step>;
}): Promise<T> => {
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
