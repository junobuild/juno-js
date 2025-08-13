import type {OnDeployProgress} from '../types/progress';

export const execute = async <Step, Result>({
  fn,
  step,
  onProgress
}: {
  fn: () => Promise<Result>;
  step: Step;
} & OnDeployProgress<Step>) => {
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
