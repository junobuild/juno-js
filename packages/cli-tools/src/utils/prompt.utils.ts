import {isNullish, nonNullish} from '@junobuild/utils';

// In case an answer is replaced by control+c
// eslint-disable-next-line local-rules/prefer-object-params
export const assertAnswerCtrlC: (
  answer: null | undefined | '' | string,
  message?: string
  // eslint-disable-next-line local-rules/prefer-object-params
) => asserts answer is NonNullable<string> = (
  answer: null | undefined | '' | string,
  message?: string
): void => {
  if (isNullish(answer) || answer === '') {
    if (nonNullish(message)) {
      console.error(message);
    }

    process.exit(1);
  }
};
