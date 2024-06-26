import {red} from 'kleur';

// In case an answer is replaced by control+c
export const assertAnswerCtrlC: (
  answer: null | undefined | '' | string,
  message?: string
) => asserts answer is NonNullable<string> = (
  answer: null | undefined | '' | string,
  message?: string
): void => {
  if (answer === undefined || answer === '' || answer === null) {
    if (message !== undefined) {
      console.log(`${red(message)}`);
    }

    process.exit(1);
  }
};
