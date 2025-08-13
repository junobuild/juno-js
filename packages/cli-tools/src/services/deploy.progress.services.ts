import type {DeployProgressStep, OnDeployProgress} from '../types/progress';

export const execute = async <T>({
  fn,
  step,
  onProgress
}: {fn: () => Promise<T>; step: DeployProgressStep} & OnDeployProgress) => {
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
