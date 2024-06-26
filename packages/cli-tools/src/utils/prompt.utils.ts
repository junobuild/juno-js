import {isNullish, nonNullish} from '@junobuild/utils';
import kleur from 'kleur';

const {red} = kleur;

// In case an answer is replaced by control+c
export const assertAnswerCtrlC: (
  answer: null | undefined | '' | string,
  message?: string
) => asserts answer is NonNullable<string> = (
  answer: null | undefined | '' | string,
  message?: string
): void => {
  if (isNullish(answer) || answer === '') {
    if (nonNullish(message)) {
      console.log(`${red(message)}`);
    }

    process.exit(1);
  }
};
